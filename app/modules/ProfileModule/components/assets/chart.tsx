"use client";

import * as React from "react";
import { Bar, BarChart, CartesianGrid, XAxis, LabelList } from "recharts";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import {
  type ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "~/components/ui/chart";

export const description = "An interactive bar chart";

const chartData = [
  {
    category: "TO 1",
    pu: 500,
    ppu: 573,
    pbm: 673,
    pk: 473,
    lbi: 773,
    lbe: 873,
    pm: 373,
  },

  {
    category: "TO 2",
    pu: 200,
    ppu: 200,
    pbm: 100,
    pk: 150,
    lbi: 300,
    lbe: 450,
    pm: 300,
  },
  {
    category: "TO 3",
    pu: 200,
    ppu: 200,
    pbm: 100,
    pk: 150,
    lbi: 300,
    lbe: 450,
    pm: 300,
  },
  {
    category: "TO 4",
    pu: 200,
    ppu: 200,
    pbm: 100,
    pk: 150,
    lbi: 300,
    lbe: 450,
    pm: 300,
  },

  {
    category: "TO 4",
    pu: 200,
    ppu: 200,
    pbm: 100,
    pk: 150,
    lbi: 300,
    lbe: 450,
    pm: 300,
  },

  {
    category: "TO 4",
    pu: 200,
    ppu: 200,
    pbm: 100,
    pk: 150,
    lbi: 300,
    lbe: 450,
    pm: 300,
  },
];

const barColors = [
  "#FF7373",
  "#FFC56F",
  "#FFFA72",
  "#79FF7E",
  "#6BC4FF",
  "#7774FF",
  "#A679FF",
];

const chartConfig = {
  views: {
    label: "Page Views",
  },
  desktop: {
    label: "Desktop",
    color: "var(--chart-2)",
  },
  mobile: {
    label: "Mobile",
    color: "var(--chart-1)",
  },
} satisfies ChartConfig;

export function ChartBarInteractive() {
  const categoryWidth = 200;
  let totalWidth = chartData.length * categoryWidth;
  return (
    <Card className="py-8 px-4 w-full h-full ">
      <CardHeader className="flex flex-row justify-between !p-0 sm:flex-row">
        <div className="flex flex-col text-3xl justify-center gap-1 px-6 pt-4 pb-3 sm:!py-0">
          <CardTitle>Progress TO</CardTitle>
        </div>
        <div className="flex flex-wrap gap-5  text-sm text-center items-center">
          <div className="flex flex-row gap-2 items-center text-center">
            <div className="bg-[#FF7373] w-4 h-4 rounded-full" />
            <p className="flex flex-row">PU</p>
          </div>
          <div className="flex flex-row gap-2 items-center text-center">
            <div className="bg-[#FFC56F] w-4 h-4 rounded-full" />
            <p className="flex flex-row">PPU</p>
          </div>
          <div className="flex flex-row gap-2 items-center text-center">
            <div className="bg-[#FFFA72] w-4 h-4 rounded-full" />
            <p className="flex flex-row">PBM</p>
          </div>
          <div className="flex flex-row gap-2 items-center text-center">
            <div className="bg-[#79FF7E] w-4 h-4 rounded-full" />
            <p className="flex flex-row">PK</p>
          </div>
          <div className="flex flex-row gap-2 items-center text-center">
            <div className="bg-[#6BC4FF] w-4 h-4 rounded-full" />
            <p className="flex flex-row">LBI</p>
          </div>
          <div className="flex flex-row gap-2 items-center text-center">
            <div className="bg-[#7774FF] w-4 h-4 rounded-full" />
            <p className="flex flex-row">LBE</p>
          </div>
          <div className="flex flex-row gap-2 items-center text-center">
            <div className="bg-[#A679FF] w-4 h-4 rounded-full" />
            <p className="flex flex-row">PM</p>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="w-full overflow-x-auto">
          <div style={chartData.length > 3 ? { width: totalWidth } : undefined}>
            <ChartContainer
              config={chartConfig}
              className="aspect-auto h-[520px] mb-8"
            >
              <BarChart
                accessibilityLayer
                data={chartData}
                margin={{
                  bottom: 12,
                }}
                barSize={10}
                barGap={10}
              >
                <XAxis
                  dataKey="category"
                  className="font-semibold text-black text-2xl"
                  tickLine={false}
                  axisLine={false}
                  tickMargin={12}
                />
                <ChartTooltip content={<ChartTooltipContent />} />
                {["pu", "ppu", "pbm", "pk", "lbi", "lbe", "pm"].map(
                  (key, index) => (
                    <Bar
                      radius={[4, 4, 4, 4]}
                      dataKey={key}
                      key={index}
                      fill={barColors[index]}
                    >
                      <LabelList
                        dataKey={key}
                        position="top" // posisikan di atas bar
                        angle={-90} // rotasi vertikal
                        offset={10} // jarak dari ujung bar
                        style={{
                          fill: "#111", // warna teks
                          fontSize: 8,
                          fontWeight: "normal",
                        }}
                      />
                    </Bar>
                  )
                )}
              </BarChart>
            </ChartContainer>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export default ChartBarInteractive;
