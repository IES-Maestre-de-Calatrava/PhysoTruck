package com.physiotrack.physiotrack.service;

import java.util.*;
import java.util.stream.*;
import org.springframework.stereotype.Service;

@Service
public class StatsService {

    public static class Sesion {
        private final String fecha;
        private final int tiempoMinutos;
        private final int numeroSesiones;
        private final double scoreDiario;
        private final int nivelActual;

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

    public int tiempoTotalMinutos() {
        return sesiones.stream()
                .mapToInt(Sesion::getTiempoMinutos)
                .sum();
    }

    public String tiempoTotalFormateado() {
        int total = tiempoTotalMinutos();
        return total / 60 + "h " + total % 60 + "min";
    }

    public double mediaDiariaMinutos() {
        return sesiones.stream()
                .mapToInt(Sesion::getTiempoMinutos)
                .average()
                .orElse(0.0);
    }

    public int totalSesiones() {
        return sesiones.stream()
                .mapToInt(Sesion::getNumeroSesiones)
                .sum();
    }

    public double mediaSesionesDiarias() {
        return sesiones.stream()
                .mapToInt(Sesion::getNumeroSesiones)
                .average()
                .orElse(0.0);
    }

    public double scorePromedio() {
        return sesiones.stream()
                .mapToDouble(Sesion::getScoreDiario)
                .average()
                .orElse(0.0);
    }

    public double scoreMaximo() {
        return sesiones.stream()
                .mapToDouble(Sesion::getScoreDiario)
                .max()
                .orElse(0.0);
    }

    public double scoreMinimo() {
        return sesiones.stream()
                .mapToDouble(Sesion::getScoreDiario)
                .min()
                .orElse(0.0);
    }

    public List<Sesion> diasConScoreSuperiorA(double umbral) {
        return sesiones.stream()
                .filter(s -> s.getScoreDiario() > umbral)
                .collect(Collectors.toList());
    }

    public int nivelActual() {
        return sesiones.get(sesiones.size() - 1).getNivelActual();
    }

    public int nivelMaximo() {
        return sesiones.stream()
                .mapToInt(Sesion::getNivelActual)
                .max()
                .orElse(0);
    }

    public int progresoNivel() {
        int inicio = sesiones.get(0).getNivelActual();
        int fin    = sesiones.get(sesiones.size() - 1).getNivelActual();
        return fin - inicio;
    }

    public void imprimirResumen() {
        System.out.println("╔══════════════════════════════════════════╗");
        System.out.println("║       RESUMEN ESTADÍSTICO DEL NIÑO       ║");
        System.out.println("╚══════════════════════════════════════════╝");

        System.out.println("\nRegistros analizados : " + sesiones.size() + " días");

        System.out.println("\nTIEMPO DE USO");
        System.out.printf("   Total            : %s (%d min)%n",
                tiempoTotalFormateado(), tiempoTotalMinutos());
        System.out.printf("   Media diaria     : %.1f min%n", mediaDiariaMinutos());

        System.out.println("\nSESIONES");
        System.out.printf("   Total acumulado  : %d%n", totalSesiones());
        System.out.printf("   Media diaria     : %.1f sesiones/día%n", mediaSesionesDiarias());

        System.out.println("\nSCORE DIARIO");
        System.out.printf("   Promedio         : %.2f%n", scorePromedio());
        System.out.printf("   Máximo           : %.2f%n", scoreMaximo());
        System.out.printf("   Mínimo           : %.2f%n", scoreMinimo());

        System.out.println("\nNIVEL");
        System.out.printf("   Nivel actual     : %d%n", nivelActual());
        System.out.printf("   Nivel máximo     : %d%n", nivelMaximo());
        System.out.printf("   Progreso total   : +%d nivel(es)%n", progresoNivel());

        System.out.println("\n─────────────────────────────────────────");
    }
}
