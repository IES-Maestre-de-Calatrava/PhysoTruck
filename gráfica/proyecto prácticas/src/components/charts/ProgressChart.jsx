import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine, Dot } from 'recharts';

const getDotColor = (score) => {
  if (score < 40) return '#dc2626';
  if (score < 70) return '#f59e0b';
  return '#16a34a';
};

const CustomizedDot = (props) => {
  const { cx, cy, payload } = props;
  const fill = getDotColor(payload.puntos);
  return <Dot cx={cx} cy={cy} r={6} stroke={fill} fill="#ffffff" strokeWidth={3} />;
};

export const ProgressChart = ({ data = [] }) => {
  return (
    <div style={{
      background: '#ffffff',
      border: '1px solid #e8eef5',
      borderRadius: '16px',
      padding: '30px 20px',
      boxShadow: '0 4px 6px -1px rgba(0,0,0,0.06)',
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '25px' }}>
        <h2 style={{ margin: '0', fontSize: '1.25rem', color: '#0d1b2e', fontWeight: '700' }}>
          Evolución del score
        </h2>
        <span style={{ fontSize: '13px', color: '#8fa3bc' }}>
          {data.length > 0 ? `${data.length} semanas` : 'Sin datos'}
        </span>
      </div>

      {data.length === 0 ? (
        <p style={{ textAlign: 'center', color: '#8fa3bc', padding: '40px 0' }}>Sin datos de progreso</p>
      ) : (
        <div style={{ width: '100%', height: 300 }}>
          <ResponsiveContainer>
            <AreaChart data={data} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
              <defs>
                <linearGradient id="colorPuntos" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#1a56a0" stopOpacity={0.25} />
                  <stop offset="95%" stopColor="#1a56a0" stopOpacity={0.01} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
              <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#8fa3bc' }} padding={{ left: 20, right: 20 }} />
              <YAxis domain={[0, 100]} axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#8fa3bc' }} width={30} />
              <Tooltip
                contentStyle={{ border: '1px solid #ccd4e4', borderRadius: '10px', boxShadow: '0 4px 12px rgba(0,0,0,0.08)', padding: '10px 15px' }}
                labelStyle={{ fontWeight: '700', color: '#0d1b2e', marginBottom: '4px' }}
                itemStyle={{ color: '#2d4163' }}
                cursor={{ stroke: '#e2e8f0', strokeWidth: 1, strokeDasharray: '3 3' }}
              />
              <ReferenceLine y={70} stroke="#fde68a" strokeDasharray="3 3" label={{ value: 'Objetivo', position: 'insideTopRight', fill: '#d97706', fontSize: 11 }} />
              <Area type="monotone" dataKey="puntos" stroke="#1a56a0" strokeWidth={3} fillOpacity={1} fill="url(#colorPuntos)" dot={<CustomizedDot />} />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  );
};
