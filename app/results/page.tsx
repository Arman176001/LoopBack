"use client";

import React, { useEffect, useState } from "react";
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
import Image from "next/image";
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

export default function Page() {
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
        const analysisData = await analysisRes.json();
        const sentimentData = await sentimentRes.json();
        setAnalysis(analysisData);
        setSentiment(sentimentData);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [videoId]);

  const pieData = sentiment?.result
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

  const timelineArray = Object.entries(timelineData).map(
    ([seconds, count]) => ({
      timestamp: `${Math.floor(Number(seconds) / 60)}:${(Number(seconds) % 60)
        .toString()
        .padStart(2, "0")}`,
      count,
    })
  );

  const timelineDataSorted = timelineArray.sort((a, b) => {
    const [aMin, aSec] = a.timestamp.split(":").map(Number);
    const [bMin, bSec] = b.timestamp.split(":").map(Number);
    return aMin * 60 + aSec - (bMin * 60 + bSec);
  });

  const formatAnalysisText = (text: string | undefined) => {
    if (!text) return ""; // Handle empty input

    const lines = text.split("\n"); // Split the text into lines
    let formattedText = "";
    let inList = false; // Track if we are inside a bullet list

    lines.forEach((line) => {
      if (line.startsWith("-") || line.startsWith("•")) {
        // If line starts with bullet point
        if (!inList) {
          formattedText += "<ul>"; // Start the list
          inList = true;
        }
        formattedText += `<li>${line.slice(1).trim()}</li>`; // Add list item
      } else {
        if (inList) {
          formattedText += "</ul>"; // Close the list
          inList = false;
        }
        if (line.startsWith("**") && line.endsWith("**")) {
          // Bold lines wrapped in **
          formattedText += `<b>${line.slice(2, -2)}</b>`;
        } else {
          formattedText += `<p>${line}</p>`; // Normal paragraph with line break
        }
      }
    });

    if (inList) {
      formattedText += "</ul>"; // Close the list if still open
    }

    return formattedText;
  };

  const onPieEnter = (_: MouseEvent, index: number) => {
    setActiveIndex(index);
  };

  const handlePieClick = (data: { name: string }) => {
    setSelectedEmotion(data.name);
    setIsDialogOpen(true);
  };

  return (
    <div className="overflow-x-clip">
      <Navbar />
      <div className="container mx-auto p-4 space-y-8">
        <h1 className="text-5xl font-bold text-center mb-8 ">
          <span className={saira.className}>Video Analysis Results</span>
        </h1>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Video Player */}
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
                        <Image
                          width={200}
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

          {/* Timeline Graph */}
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

          {/* Sentiment Pie Chart */}
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
                        activeShape={renderActiveShape}
                        data={pieData}
                        innerRadius={90}
                        outerRadius={140}
                        dataKey="value"
                        onMouseEnter={onPieEnter}
                        onClick={handlePieClick}
                      >
                        {pieData.map((entry, index) => (
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

          {/* AI Summary */}
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
    </div>
  );
}

// Custom active shape for pie chart with hover details
const renderActiveShape = (props: any) => {
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
