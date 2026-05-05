// src/components/charts/ProgressChart.jsx
import { AreaChart, Area, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine, Dot } from 'recharts';

// Datos de ejemplo: he equilibrado la puntuación
const data = [
    { name: 'Sem 1', puntos: 40 },
    { name: 'Sem 2', puntos: 61 },
    { name: 'Sem 3', puntos: 55 },
    { name: 'Sem 4', puntos: 75 },
    { name: 'Sem 5', puntos: 82 },
];

// Helper para colores: definimos el color de los puntos
const getDotColors = (score) => {
    if (score < 40) return '#dc2626'; // Rojo vibrante
    if (score < 70) return '#f59e0b'; // Naranja vibrante
    return '#16a34a';             // Verde vibrante
};

// Componente personalizado para renderizar los puntos con color dinámico
const CustomizedDot = (props) => {
    const { cx, cy, payload } = props;
    const fill = getDotColors(payload.puntos);
    return (
        <Dot cx={cx} cy={cy} r={6} stroke={fill} fill="#ffffff" strokeWidth={3} />
    );
};

export const ProgressChart = () => {
    return (
        <div style={{
            background: '#ffffff',
            border: '1px solid #e5e7eb',
            borderRadius: '16px',
            padding: '30px 20px', // Más espaciado interno
            boxShadow: '0 10px 15px -3px rgba(0,0,0,0.05)',
            marginTop: '10px'
        }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '25px' }}>
                <h2 style={{ margin: '0', fontSize: '22px', color: '#111827', fontWeight: '700' }}>
                    Evolución GMFM
                </h2>
                <span style={{ fontSize: '14px', color: '#6b7280' }}>Últimas 5 semanas</span>
            </div>

            <div style={{ width: '100%', height: 350 }}> {/* Gráfica más alta para mejor visualización */}
                <ResponsiveContainer>
                    <AreaChart data={data} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                        <defs>
                            {/* DEFINICIÓN DEL GRADIENTE DE FONDO (Le da el toque chulo) */}
                            <linearGradient id="colorPuntos" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
                                <stop offset="95%" stopColor="#3b82f6" stopOpacity={0.01} />
                            </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
                        <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#6b7280' }} padding={{ left: 20, right: 20 }} />
                        <YAxis domain={[0, 100]} axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#6b7280' }} width={30} />
                        <Tooltip
                            contentStyle={{ border: 'none', borderRadius: '12px', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)', padding: '10px 15px' }}
                            labelStyle={{ fontWeight: '700', marginBottom: '5px' }}
                            itemStyle={{ color: '#111827' }}
                            cursor={{ stroke: '#e5e7eb', strokeWidth: 1, strokeDasharray: '3 3' }}
                        />

                        {/* Referencia opcional para marcar el objetivo */}
                        <ReferenceLine y={70} stroke="#fde68a" strokeDasharray="3 3" label={{ value: 'Objetivo', position: 'insideTopRight', fill: '#d97706', fontSize: 11 }} />

                        {/* GRÁFICA DE ÁREA DEGRADADA */}
                        <Area type="monotone" dataKey="puntos" stroke="#3b82f6" strokeWidth={3} fillOpacity={1} fill="url(#colorPuntos)" dot={<CustomizedDot />} />
                    </AreaChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
};