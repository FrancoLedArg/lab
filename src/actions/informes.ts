"use server";

import { actionClient } from "@/lib/safe-action";
import { db } from "@/lib/db";
import { report, medicalOrder } from "@/lib/db/schema";
import { desc } from "drizzle-orm";

/**
 * Obtiene informes agrupados por día de creación
 * Retorna un objeto donde las claves son fechas (YYYY-MM-DD) y los valores son arrays de informes
 * con toda su información relacionada (paciente, prácticas, autorizaciones, etc.)
 */
export const getInformesByDay = actionClient
  .metadata({ actionName: "getInformesByDay" })
  .action(async () => {
    const informes = await db.query.report.findMany({
      orderBy: [desc(report.createdAt)],
      with: {
        patient: true,
        medicalOrders: {
          with: {
            patient: true,
            administrativeHolder: {
              with: {
                insuranceProvider: true,
              },
            },
            orderPractices: {
              with: {
                practice: true,
              },
            },
            authorizations: {
              with: {
                authorizedPractices: {
                  with: {
                    orderPractice: {
                      with: {
                        practice: true,
                      },
                    },
                  },
                },
                copayment: true,
              },
            },
            resultDeliveries: true,
          },
        },
      },
    });

    // Agrupar informes por día
    const informesByDay: Record<string, typeof informes> = {};

    informes.forEach((informe) => {
      const dateKey = informe.createdAt.toISOString().split("T")[0]; // YYYY-MM-DD
      if (!informesByDay[dateKey]) {
        informesByDay[dateKey] = [];
      }
      informesByDay[dateKey].push(informe);
    });

    // Convertir a array ordenado por fecha (más reciente primero)
    const sortedDays = Object.entries(informesByDay).sort((a, b) =>
      b[0].localeCompare(a[0])
    );

    return sortedDays.map(([date, informes]) => ({
      date,
      informes,
      count: informes.length,
    }));
  });
