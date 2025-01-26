export default function BanterLoader() {
    return (
      <div className="absolute left-1/2 top-1/2 w-[72px] h-[72px] -ml-[36px] -mt-[36px]">
        {[...Array(9)].map((_, i) => (
          <div
            key={i}
            className={`
              float-left relative w-[20px] h-[20px] mr-[6px] last:mb-0
              before:content-[''] before:absolute before:left-0 before:top-0 
              before:w-full before:h-full before:bg-white
              ${(i + 1) % 3 === 0 ? 'mr-0 mb-[6px]' : ''}
              ${i === 0 || i === 3 ? 'before:ml-[26px]' : ''}
              ${i === 2 ? 'before:mt-[52px]' : ''}
              animate-[moveBox-${i + 1}_4s_infinite]
            `}
          />
        ))}
      </div>
    );
  }