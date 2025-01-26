"use client";

import React, {useEffect, useState, Suspense} from "react";
import { useSearchParams } from "next/navigation";
import { Saira_Stencil_One } from 'next/font/google';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Line,
  LineChart,
  Pie,
  PieChart,
  Sector,
  ResponsiveContainer,
  XAxis,
  YAxis,
  Tooltip,
  Cell,
} from "recharts";
import {
  ChartContainer,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import type {
  AnalysisResponse,
  SentimentResponse,
} from "../types/analysis";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import Navbar from "@/components/Navbar";

const saira = Saira_Stencil_One({ weight: "400", subsets: ["latin"] });

const COLORS = [
  "#FF6B6B",
  "#4ECDC4",
  "#45B7D1",
  "#FFA07A",
  "#98D8C8",
  "#F06292",
  "#AED581",
  "#7986CB",
  "#9575CD",
  "#4DB6AC",
  "#FFF176",
  "#FFB74D",
];

interface ActiveShapeProps {
  cx: number;
  cy: number;
  innerRadius: number;
  outerRadius: number;
  startAngle: number;
  endAngle: number;
  fill: string;
  payload: {
    name: string;
  };
  percent: number;
  value: number;
}

interface TimelineData {
  timestamp: string;
  count: number;
}

interface PieChartData {
  name: string;
  value: number;
}

const renderActiveShape = (props: ActiveShapeProps) => {
  const {
    cx,
    cy,
    innerRadius,
    outerRadius,
    startAngle,
    endAngle,
    fill,
    payload,
    percent,
    value,
  } = props;

  return (
    <g>
      <text
        x={cx}
        y={cy}
        dy={-4}
        textAnchor="middle"
        fill={fill}
        className="text-lg font-semibold"
      >
        {payload.name}
      </text>
      <text x={cx} y={cy} dy={20} textAnchor="middle" fill={fill}>
        {`${value} comments (${(percent * 100).toFixed(2)}%)`}
      </text>
      <Sector
        cx={cx}
        cy={cy}
        innerRadius={innerRadius}
        outerRadius={outerRadius}
        startAngle={startAngle}
        endAngle={endAngle}
        fill={fill}
      />
      <Sector
        cx={cx}
        cy={cy}
        startAngle={startAngle}
        endAngle={endAngle}
        innerRadius={outerRadius + 6}
        outerRadius={outerRadius + 10}
        fill={fill}
      />
    </g>
  );
};

function ResultsContent() {
  const searchParams = useSearchParams();
  const videoId = searchParams?.get("videoId");
  const [analysis, setAnalysis] = useState<AnalysisResponse | null>(null);
  const [sentiment, setSentiment] = useState<SentimentResponse | null>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedEmotion, setSelectedEmotion] = useState<string | null>(null);

  useEffect(() => {
    if (!videoId) return;

    const fetchData = async () => {
      setIsLoading(true);
      try {
        const [analysisRes, sentimentRes] = await Promise.all([
          fetch(`/api/analysis?videoId=${videoId}`, { method: "POST" }),
          fetch(`/api/sentiment?videoId=${videoId}`, { method: "POST" }),
        ]);

        if (!analysisRes.ok || !sentimentRes.ok) {
          throw new Error('One or more API requests failed');
        }

        const analysisData = await analysisRes.json().catch(error => {
          console.error("Error parsing analysis JSON:", error);
          return null;
        });

        const sentimentData = await sentimentRes.json().catch(error => {
          console.error("Error parsing sentiment JSON:", error);
          return null;
        });

        if (analysisData && sentimentData) {
          setAnalysis(analysisData);
          setSentiment(sentimentData);
        } else {
          throw new Error('Failed to parse response data');
        }
      } catch (error) {
        console.error("Error fetching data:", error);
        // Optionally set some error state here to show to the user
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [videoId]);

  const pieData: PieChartData[] = sentiment?.result
    ? Object.entries(sentiment.result)
        .map(([key, value]) => ({
          name: key,
          value: value.length,
        }))
        .filter((item) => item.value > 0)
        .sort((a, b) => b.value - a.value)
    : [];

  const timelineData = sentiment?.result
    ? Object.values(sentiment.result)
        .flat()
        .map((comment) => {
          const timeMatch = comment.match(/(\d+):(\d+)/);
          if (timeMatch) {
            const [, minutes, seconds] = timeMatch.map(Number);
            const totalSeconds = minutes * 60 + seconds;
            const binStart = Math.floor(totalSeconds / 30) * 30;
            return binStart;
          }
          return null;
        })
        .filter(Boolean as unknown as <T>(x: T | null | undefined) => x is T)
        .reduce((acc: { [key: number]: number }, seconds: number) => {
          acc[seconds] = (acc[seconds] || 0) + 1;
          return acc;
        }, {})
    : {};
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const timelineArray: TimelineData[] = Object.entries(timelineData).map(
    ([seconds, count]) => ({
      timestamp: `${Math.floor(Number(seconds) / 60)}:${(Number(seconds) % 60)
        .toString()
        .padStart(2, "0")}`,
      count,
    })
  );
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const timelineDataSorted = timelineArray.sort((a, b) => {
    const [aMin, aSec] = a.timestamp.split(":").map(Number);
    const [bMin, bSec] = b.timestamp.split(":").map(Number);
    return aMin * 60 + aSec - (bMin * 60 + bSec);
  });
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const formatAnalysisText = (text: string | undefined) => {
    if (!text) return ""; 

    const lines = text.split("\n");
    let formattedText = "";
    let inList = false;

    lines.forEach((line) => {
      if (line.startsWith("-") || line.startsWith("•")) {
        if (!inList) {
          formattedText += "<ul>"; 
          inList = true;
        }
        formattedText += `<li>${line.slice(1).trim()}</li>`; 
      } else {
        if (inList) {
          formattedText += "</ul>"; 
          inList = false;
        }
        if (line.startsWith("**") && line.endsWith("**")) {
          formattedText += `<b>${line.slice(2, -2)}</b>`;
        } else {
          formattedText += `<p>${line}</p>`; 
        }
      }
    });

    if (inList) {
      formattedText += "</ul>"; 
    }

    return formattedText;
  };
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const onPieEnter = (_props: { payload: { name: string } }, index: number) => {
    setActiveIndex(index);
  };
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handlePieClick = (data: { name: string }) => {
    setSelectedEmotion(data.name);
    setIsDialogOpen(true);
  };
  

  return (
    <div className="overflow-x-clip">
      {isLoading ? (
        <div className="fixed inset-0 flex flex-col items-center justify-center">
          {/* Glass effect background - reduced blur */}
          <div className="absolute inset-0 bg-white/50 dark:bg-black/50 backdrop-blur-sm" />
          
          {/* Loading spinner - made smaller */}
          <div className="p-3 animate-spin drop-shadow-2xl bg-gradient-to-bl from-pink-400 via-purple-400 to-indigo-600 md:w-32 md:h-32 h-24 w-24 aspect-square rounded-full z-10">
            <div className="rounded-full h-full w-full bg-slate-100 dark:bg-zinc-900 background-blur-md" />
          </div>

          {/* Loading text */}
          <p className="mt-8 text-xl font-medium text-gray-700 dark:text-gray-200 z-10">
            Grab a coffee, this might take some time ☕
          </p>
        </div>
      ) : (
        <>
          <Navbar />
          <div className="container mx-auto p-4 space-y-8">
            <h1 className="text-5xl font-bold text-center mb-8 ">
              <span className={saira.className}>Video Analysis Results</span>
            </h1>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <Card className="col-span-1 md:col-span-2 shadow-lg flex flex-col md:flex-row">
                <div className="w-full md:w-[70%] aspect-video p-4">
                  {isLoading ? (
                    <Skeleton className="w-full h-full" />
                  ) : (
                    <iframe
                      width="100%"
                      height="100%"
                      src={`https://www.youtube.com/embed/${videoId}`}
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                      className="rounded-lg"
                    />
                  )}
                </div>
                <div className="w-full md:w-[30%] p-4 pl-0 flex flex-col justify-center items-center space-y-4">
                  <div className="py-8 px-4 sm:px-6 lg:px-8">
                    <div className="max-w-7xl mx-auto">
                      <div className="max-w-3xl mx-auto text-center">
                        <h2 className="text-3xl font-extrabold text-gray-900 dark:text-white sm:text-4xl">
                          Like my app 😊
                        </h2>
                        <p className="mt-3 text-xl text-gray-500 dark:text-gray-400 sm:mt-4">
                          Consider buying me a coffee to support my work!
                        </p>
                        <div className="mt-8">
                          <a href="https://buymeacoffee.com/arman176">
                            <img
                              width={225}
                              height={64}
                              className="mx-auto h-16 hover:scale-110 transition-transform ease-in duration-150"
                              src="https://cdn.buymeacoffee.com/buttons/v2/default-yellow.png"
                              alt="Buy Me a Coffee"
                            />
                          </a>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div id="bmc-button-container"></div>
                </div>
              </Card>
    
              <Card className="shadow-lg">
                <CardHeader>
                  <CardTitle className="text-xl font-semibold">
                    Comments Timeline (30-second bins)
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {isLoading ? (
                    <Skeleton className="w-full h-[300px]" />
                  ) : (
                    <ChartContainer className="h-[300px]" config={{}}>
                      <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={timelineDataSorted}>
                          <XAxis
                            dataKey="timestamp"
                            interval={Math.ceil(timelineDataSorted.length / 10)}
                            angle={-45}
                            textAnchor="end"
                            height={50}
                          />
                          <YAxis />
                          <Tooltip content={<ChartTooltipContent />} />
                          <Line
                            type="monotone"
                            dataKey="count"
                            stroke="#FF6B6B"
                            strokeWidth={2}
                            dot={{ fill: "#FF6B6B", r: 4 }}
                          />
                        </LineChart>
                      </ResponsiveContainer>
                    </ChartContainer>
                  )}
                </CardContent>
              </Card>
    
              <Card className="shadow-lg">
                <CardHeader>
                  <CardTitle className="text-xl font-semibold">
                    Comment Emotions
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {isLoading ? (
                    <Skeleton className="w-full h-[300px]" />
                  ) : (
                    <ChartContainer className="h-[300px]" config={{}}>
                      <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                          <Pie
                            activeIndex={activeIndex}
                            // eslint-disable-next-line @typescript-eslint/no-explicit-any
                            activeShape={(props: any) => renderActiveShape(props)}
                            data={pieData}
                            innerRadius={90}
                            outerRadius={140}
                            dataKey="value"
                            onMouseEnter={onPieEnter}
                            onClick={handlePieClick}
                          >
                            {pieData.map((entry, index) => (
                              // eslint-disable-next-line @typescript-eslint/no-explicit-any
                              <Cell
                                key={`cell-${index}`}
                                fill={COLORS[index % COLORS.length]}
                              />
                            ))}
                          </Pie>
                        </PieChart>
                      </ResponsiveContainer>
                    </ChartContainer>
                  )}
                </CardContent>
              </Card>
    
              <Card className="col-span-1 md:col-span-2 shadow-lg">
                <CardHeader>
                  <CardTitle className="text-xl font-semibold">
                    AI Comments Summary
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {isLoading ? (
                    <Skeleton className="w-full h-24" />
                  ) : (
                    <div className="space-y-4">
                      <div
                        className="text-lg space-y-2"
                        dangerouslySetInnerHTML={{
                          __html: formatAnalysisText(analysis?.result),
                        }}
                      />
                      <div className="flex flex-wrap gap-2">
                        {pieData.slice(0, 5).map((item, index) => (
                          <Badge
                            key={index}
                            variant="secondary"
                            onClick={() => {
                              setSelectedEmotion(item.name);
                              setIsDialogOpen(true);
                            }}
                            style={{
                              backgroundColor: COLORS[index % COLORS.length],
                              color: "#fff",
                            }}
                          >
                            {item.name}: {item.value}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogContent className="max-w-4xl max-h-[80vh] flex flex-col overflow-hidden">
                <DialogHeader>
                  <DialogTitle>{selectedEmotion} Comments</DialogTitle>
                  <DialogDescription>
                    Comments expressing {selectedEmotion?.toLowerCase()} sentiment
                  </DialogDescription>
                </DialogHeader>
                <ScrollArea className="flex-grow h-full overflow-y-auto">
                  <div className="space-y-4 p-4">
                    {sentiment?.result &&
                      selectedEmotion &&
                      sentiment.result[selectedEmotion]?.map(
                        (comment: string, index: number) => (
                          <div key={index} className="bg-gray-100 p-3 rounded-lg">
                            <p>{comment}</p>
                          </div>
                        )
                      )}
                  </div>
                </ScrollArea>
              </DialogContent>
            </Dialog>
          </div>
        </>
      )}
    </div>
  );
}

// Create a loading component
function Loading() {
  return <div className="text-center p-4">Loading...</div>;
}

// Create the main page component
export default function Page() {
  return (
    <Suspense fallback={<Loading />}>
      <ResultsContent />
    </Suspense>
  );
}
