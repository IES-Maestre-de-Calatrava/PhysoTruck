package practica;

import java.util.*;
import java.util.stream.*;

/**
 * Clase para calcular estadísticas de uso de un niño
 * a partir de listas de sesiones registradas.
 */
public class StatsService {

    // ─────────────────────────────────────────────
    // Modelo de datos: una sesión individual
    // ─────────────────────────────────────────────
    public static class Sesion {
        private final String fecha;          // "YYYY-MM-DD"
        private final int tiempoMinutos;     // Tiempo total de uso en minutos
        private final int numeroSesiones;    // Número de sesiones en ese día
        private final double scoreDiario;    // Score diario (0.0 – 100.0)
        private final int nivelActual;       // Nivel actual del niño

        public Sesion(String fecha, int tiempoMinutos, int numeroSesiones,
                      double scoreDiario, int nivelActual) {
            this.fecha          = fecha;
            this.tiempoMinutos  = tiempoMinutos;
            this.numeroSesiones = numeroSesiones;
            this.scoreDiario    = scoreDiario;
            this.nivelActual    = nivelActual;
        }

        public String getFecha()          { return fecha; }
        public int getTiempoMinutos()     { return tiempoMinutos; }
        public int getNumeroSesiones()    { return numeroSesiones; }
        public double getScoreDiario()    { return scoreDiario; }
        public int getNivelActual()       { return nivelActual; }

        @Override
        public String toString() {
            return String.format("[%s] tiempo=%dmin | sesiones=%d | score=%.1f | nivel=%d",
                    fecha, tiempoMinutos, numeroSesiones, scoreDiario, nivelActual);
        }
    }

    private List<Sesion> sesiones = null;

    public void ChildStatsCalculator(List<Sesion> sesiones) {
        if (sesiones == null || sesiones.isEmpty()) {
            throw new IllegalArgumentException("La lista de sesiones no puede estar vacía.");
        }
        this.sesiones = new ArrayList<>(sesiones);
    }

    // ════════════════════════════════════════════════════════════
    // 1. TIEMPO TOTAL DE USO (minutos)
    // ════════════════════════════════════════════════════════════

    /** Suma de todos los minutos registrados. */
    public int tiempoTotalMinutos() {
        return sesiones.stream()
                .mapToInt(Sesion::getTiempoMinutos)
                .sum();
    }

    /** Tiempo total convertido a horas y minutos (String legible). */
    public String tiempoTotalFormateado() {
        int total = tiempoTotalMinutos();
        return total / 60 + "h " + total % 60 + "min";
    }

    // ════════════════════════════════════════════════════════════
    // 2. MEDIA DIARIA DE MINUTOS
    // ════════════════════════════════════════════════════════════

    /** Promedio de minutos por registro (día). */
    public double mediaDiariaMinutos() {
        return sesiones.stream()
                .mapToInt(Sesion::getTiempoMinutos)
                .average()
                .orElse(0.0);
    }

    // ════════════════════════════════════════════════════════════
    // 3. NÚMERO TOTAL DE SESIONES
    // ════════════════════════════════════════════════════════════

    /** Suma de todas las sesiones acumuladas. */
    public int totalSesiones() {
        return sesiones.stream()
                .mapToInt(Sesion::getNumeroSesiones)
                .sum();
    }

    /** Promedio de sesiones por día. */
    public double mediaSesionesDiarias() {
        return sesiones.stream()
                .mapToInt(Sesion::getNumeroSesiones)
                .average()
                .orElse(0.0);
    }

    // ════════════════════════════════════════════════════════════
    // 4. SCORE DIARIO
    // ════════════════════════════════════════════════════════════

    /** Score promedio de todos los días. */
    public double scorePromedio() {
        return sesiones.stream()
                .mapToDouble(Sesion::getScoreDiario)
                .average()
                .orElse(0.0);
    }

    /** Score máximo registrado. */
    public double scoreMaximo() {
        return sesiones.stream()
                .mapToDouble(Sesion::getScoreDiario)
                .max()
                .orElse(0.0);
    }

    /** Score mínimo registrado. */
    public double scoreMinimo() {
        return sesiones.stream()
                .mapToDouble(Sesion::getScoreDiario)
                .min()
                .orElse(0.0);
    }

    /** Días en que el score superó un umbral dado. */
    public List<Sesion> diasConScoreSuperiorA(double umbral) {
        return sesiones.stream()
                .filter(s -> s.getScoreDiario() > umbral)
                .collect(Collectors.toList());
    }

    // ════════════════════════════════════════════════════════════
    // 5. NIVEL ACTUAL DEL NIÑO
    // ════════════════════════════════════════════════════════════

    /** Nivel más reciente (último registro de la lista). */
    public int nivelActual() {
        return sesiones.get(sesiones.size() - 1).getNivelActual();
    }

    /** Nivel máximo alcanzado. */
    public int nivelMaximo() {
        return sesiones.stream()
                .mapToInt(Sesion::getNivelActual)
                .max()
                .orElse(0);
    }

    /** Cuántos niveles subió el niño desde el primer al último registro. */
    public int progresoNivel() {
        int inicio = sesiones.get(0).getNivelActual();
        int fin    = sesiones.get(sesiones.size() - 1).getNivelActual();
        return fin - inicio;
    }

    // ════════════════════════════════════════════════════════════
    // 6. RESUMEN COMPLETO
    // ════════════════════════════════════════════════════════════

    /** Imprime un resumen estadístico completo en consola. */
    public void imprimirResumen() {
        System.out.println("╔══════════════════════════════════════════╗");
        System.out.println("║       RESUMEN ESTADÍSTICO DEL NIÑO       ║");
        System.out.println("╚══════════════════════════════════════════╝");

        System.out.println("\n📅 Registros analizados : " + sesiones.size() + " días");

        System.out.println("\n⏱  TIEMPO DE USO");
        System.out.printf("   Total            : %s (%d min)%n",
                tiempoTotalFormateado(), tiempoTotalMinutos());
        System.out.printf("   Media diaria     : %.1f min%n", mediaDiariaMinutos());

        System.out.println("\n🔁 SESIONES");
        System.out.printf("   Total acumulado  : %d%n", totalSesiones());
        System.out.printf("   Media diaria     : %.1f sesiones/día%n", mediaSesionesDiarias());

        System.out.println("\n🏆 SCORE DIARIO");
        System.out.printf("   Promedio         : %.2f%n", scorePromedio());
        System.out.printf("   Máximo           : %.2f%n", scoreMaximo());
        System.out.printf("   Mínimo           : %.2f%n", scoreMinimo());

        System.out.println("\n⭐ NIVEL");
        System.out.printf("   Nivel actual     : %d%n", nivelActual());
        System.out.printf("   Nivel máximo     : %d%n", nivelMaximo());
        System.out.printf("   Progreso total   : +%d nivel(es)%n", progresoNivel());

        System.out.println("\n─────────────────────────────────────────");
    }

    // ════════════════════════════════════════════════════════════
    // MAIN — ejemplo de uso
    // ════════════════════════════════════════════════════════════
    public static void main(String[] args) {

        List<Sesion> datos = Arrays.asList(
            new Sesion("2024-05-01", 30,  2, 72.5, 3),
            new Sesion("2024-05-02", 45,  3, 88.0, 3),
            new Sesion("2024-05-03", 20,  1, 65.0, 3),
            new Sesion("2024-05-04", 60,  4, 91.5, 4),
            new Sesion("2024-05-05", 35,  2, 78.0, 4),
            new Sesion("2024-05-06", 50,  3, 95.0, 5),
            new Sesion("2024-05-07", 40,  3, 83.5, 5)
        );

        StatsService calc = new StatsService();
        calc.imprimirResumen();

        System.out.println("\n📌 Días con score > 85:");
        calc.diasConScoreSuperiorA(85).forEach(System.out::println);
    }
}
