import { useEffect, useMemo, useState } from "react";
import { Card, Row, Col, Skeleton, Empty } from "antd";
import axios from "axios";
import dayjs from "dayjs";
import { useDispatch, useSelector } from "react-redux";
// Chart.js
import {
  Chart as ChartJS,
  CategoryScale, LinearScale, BarElement, ArcElement,
  Title, Tooltip, Legend,
} from "chart.js";
import { Bar, Doughnut } from "react-chartjs-2";

ChartJS.register(
  CategoryScale, LinearScale, BarElement, ArcElement,
  Title, Tooltip, Legend
);

export default function DashboardCharts({
  messagesPerDayUrl = "http://30.30.30.12:8080/api/message/report-message/",
  totalUsersUrl    ="http://30.30.30.12:8080/api/user/report-alluser/",
  totalUsersManual = null,
}) {
  const [loading, setLoading] = useState(true);
  const [msgData, setMsgData] = useState([]); // [{date:'YYYY-MM-DD', count: number}]
  const [onlineCount, setOnlineCount] = useState(0);
  const [totalUsers, setTotalUsers] = useState(null);
  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        // 1) Tin nhắn theo ngày
        const resMsg = await axios.get(messagesPerDayUrl);
        // { status:1, data: [{count, date:"YYYY-MM-DD"}] }
        const list = Array.isArray(resMsg?.data?.data) ? resMsg.data.data : [];
        setMsgData(list);

        // 2) Số user 
        const resOnline = useSelector(state=>state.data.userOnline);
        //  { status:1, data: <number> }
        setOnlineCount(Number(resOnline.length || 0));

        if (totalUsersUrl) {
          const resTotal = await axios.get(totalUsersUrl);
          setTotalUsers(Number(resTotal?.data?.data.length ?? null));
        } else if (typeof totalUsersManual === "number") {
          setTotalUsers(totalUsersManual);
        } else {
          setTotalUsers(null); // không có tổng -> sẽ hiển thị online 1 lát, offline=0
        }
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    })();
  }, [messagesPerDayUrl, totalUsersUrl, totalUsersManual]);

  const { barLabels, barCounts } = useMemo(() => {
    if (!msgData.length) return { barLabels: [], barCounts: [] };
    // sắp xếp theo ngày tăng dần
    const sorted = [...msgData].sort((a, b) => a.date.localeCompare(b.date));
    const start = dayjs(sorted[0].date);
    const end   = dayjs(sorted[sorted.length - 1].date);

    const labels = [];
    const counts = [];
    let d = start;
    const map = new Map(sorted.map(i => [i.date, Number(i.count)]));

    while (d.isBefore(end) || d.isSame(end, "day")) {
      const key = d.format("YYYY-MM-DD");
      labels.push(dayjs(key).format("DD/MM"));
      counts.push(map.get(key) || 0);
      d = d.add(1, "day");
    }
    return { barLabels: labels, barCounts: counts };
  }, [msgData]);

  //  Dữ liệu tròn
  // const online = onlineCount;
  // const offline = totalUsers != null ? Math.max(totalUsers - online, 0) : 0;
const online = 20;
  const offline = 40;

  const barData = {
    labels: barLabels,
    datasets: [
      {
        label: "Tin nhắn / ngày",
        data: barCounts,
        backgroundColor: "rgba(22, 119, 255, 0.6)", // xanh AntD
        borderColor: "rgba(22, 119, 255, 1)",
        borderWidth: 1,
        borderRadius: 6,
      },
    ],
  };

  const barOptions = {
    responsive: true,
    plugins: {
      legend: { display: false },
      title: { display: false },
      tooltip: { mode: "index", intersect: false },
    },
    scales: {
      x: { grid: { display: false } },
      y: { beginAtZero: true, ticks: { precision: 0 } },
    },
  };

  const doughnutData = {
    labels: ["Online", "Offline"],
    datasets: [
      {
        data: [online, offline],
        backgroundColor: ["#52c41a", "#d9d9d9"],
        borderWidth: 0,
      },
    ],
  };

  const doughnutOptions = {
    responsive: true,
    plugins: {
      legend: { position: "bottom" },
      title: { display: false },
      tooltip: { callbacks: {
        label: (ctx) => `${ctx.label}: ${ctx.parsed} user`
      }}
    },
    cutout: "60%",
  };

  return (
    <Row gutter={[16, 16]}>
      <Col xs={24} lg={16}>
        <Card title="Tin nhắn theo ngày" className="rounded-xl shadow-sm">
          {loading ? (
            <Skeleton active />
          ) : barLabels.length ? (
            <Bar data={barData} options={barOptions} />
          ) : (
            <Empty description="Không có dữ liệu" />
          )}
        </Card>
      </Col>

      <Col xs={24} lg={8}>
        <Card
          title="Người dùng online / offline"
          extra={
            totalUsers != null ? (
              <span className="text-xs text-neutral-500">
                Tổng: <b>{totalUsers}</b>
              </span>
            ) : null
          }
          className="rounded-xl shadow-sm"
        >
          {loading ? (
            <Skeleton active />
          ) : (
            <>
              <Doughnut data={doughnutData} options={doughnutOptions} />
              <div className="mt-4 text-sm text-neutral-600">
                Online: <b className="text-green-600">{online}</b>
                {totalUsers != null && (
                  <> &nbsp;•&nbsp; Offline: <b>{offline}</b></>
                )}
              </div>
            </>
          )}
        </Card>
      </Col>
    </Row>
  );
}
