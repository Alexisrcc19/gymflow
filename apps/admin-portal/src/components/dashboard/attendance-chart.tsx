import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@gymflow/ui';

import { attendancePoints } from './dashboard-data';

const width = 720;
const height = 230;
const chartTop = 12;
const chartBottom = 195;
const maxValue = 420;

function createPoints(key: 'attendance' | 'classes') {
  return attendancePoints
    .map((point, index) => {
      const x = (index / (attendancePoints.length - 1)) * width;
      const y =
        chartBottom - (point[key] / maxValue) * (chartBottom - chartTop);
      return `${x},${y}`;
    })
    .join(' ');
}

export function AttendanceChart() {
  const attendance = createPoints('attendance');
  const classes = createPoints('classes');

  return (
    <Card className="min-w-0 xl:col-span-2">
      <CardHeader className="flex grid-cols-none flex-row flex-wrap items-start justify-between gap-4 border-b border-border">
        <div>
          <CardTitle>Attendance trend</CardTitle>
          <CardDescription>
            Daily check-ins and class attendance
          </CardDescription>
        </div>
        <div className="flex items-center gap-4 text-xs text-muted-foreground">
          <span className="flex items-center gap-1.5">
            <span className="size-2 rounded-full bg-primary" />
            Check-ins
          </span>
          <span className="flex items-center gap-1.5">
            <span className="size-2 rounded-full bg-success" />
            Classes
          </span>
        </div>
      </CardHeader>
      <CardContent className="pt-5">
        <svg
          aria-label="Attendance rises from 270 on Monday to 389 on Friday, then decreases to 174 on Sunday."
          className="h-auto w-full overflow-visible"
          role="img"
          viewBox={`-35 0 ${width + 45} ${height}`}
        >
          {[0, 100, 200, 300, 400].map((value) => {
            const y =
              chartBottom - (value / maxValue) * (chartBottom - chartTop);
            return (
              <g key={value}>
                <line
                  stroke="var(--gymflow-color-border)"
                  strokeDasharray="3 4"
                  x1="0"
                  x2={width}
                  y1={y}
                  y2={y}
                />
                <text
                  fill="var(--gymflow-color-muted-foreground)"
                  fontSize="11"
                  textAnchor="end"
                  x="-10"
                  y={y + 4}
                >
                  {value}
                </text>
              </g>
            );
          })}
          <polygon
            fill="color-mix(in srgb, var(--gymflow-color-primary) 10%, transparent)"
            points={`0,${chartBottom} ${attendance} ${width},${chartBottom}`}
          />
          <polyline
            fill="none"
            points={attendance}
            stroke="var(--gymflow-color-primary)"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2.5"
          />
          <polyline
            fill="none"
            points={classes}
            stroke="var(--gymflow-color-success)"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
          />
          {attendancePoints.map((point, index) => (
            <text
              fill="var(--gymflow-color-muted-foreground)"
              fontSize="11"
              key={point.day}
              textAnchor="middle"
              x={(index / (attendancePoints.length - 1)) * width}
              y="222"
            >
              {point.day}
            </text>
          ))}
        </svg>
      </CardContent>
    </Card>
  );
}
