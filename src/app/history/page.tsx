"use client";

import { Card } from "@/components/Card/Card";
import { CollapsibleContainer } from "@/components/CollapsibleContainer/CollapsibleContainer";
import { HexagramText } from "@/components/HexagramText/HexagramText";
import { Spinner } from "@/components/Spinner/Spinner";
import {
  findHexagram,
  getHexagramByNumber,
  getTranslationKeysForHexagramNumber,
  getTrigrams,
} from "@/utils/iching";
import { format } from "date-fns";
import Image from "next/image";
import React, { useEffect, useState } from "react";

import styles from "./page.module.css";
import { TossMode } from "@/generated/prisma";
import Markdown from "react-markdown";

interface HistoryItem {
  id: string;
  createdAt: string;
  intention: string;
  hexagram: number;
  mode: TossMode;
  interpretation: string;
}

const HistoryPage: React.FC = () => {
  const [data, setData] = useState<{
    success: boolean;
    history: HistoryItem[];
  } | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const response = await fetch("/api/history");
        if (!response.ok) {
          throw new Error("Failed to fetch history");
        }
        const data: { success: boolean; history: HistoryItem[] } =
          await response.json();
        setData(data);
      } catch (error) {
        console.error("Error fetching history:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchHistory();
  }, []);

  if (loading) {
    return (
      <div className={styles.historyContainer}>
        <div className={styles.historyHeader}>
          <Image
            src="/logo/logo_white.png"
            alt="aiChing Logo"
            width={128}
            height={128}
          />
          <h1>Reading History</h1>
        </div>
        <Spinner />
      </div>
    );
  }

  function isThisMonth(date: Date): boolean {
    const now = new Date();
    return (
      date.getFullYear() === now.getFullYear() &&
      date.getMonth() === now.getMonth()
    );
  }

  return (
    <div className={styles.historyContainer}>
      <div className={styles.historyHeader}>
        <Image
          src="/logo/logo_white.png"
          alt="aiChing Logo"
          width={128}
          height={128}
        />
        <h1>Reading History</h1>
      </div>
      <div className={styles.historyContent}>
        <div className={styles.historyStats}>
          <Card className={styles.cardWithBackground}>
            <div className={styles.historyStat}>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="size-6"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="m20.25 7.5-.625 10.632a2.25 2.25 0 0 1-2.247 2.118H6.622a2.25 2.25 0 0 1-2.247-2.118L3.75 7.5M10 11.25h4M3.375 7.5h17.25c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125Z"
                />
              </svg>
              <h2>{data?.history?.length || 0}</h2>
              <p>Total readings</p>
            </div>
          </Card>
          <Card className={styles.cardWithBackground}>
            <div className={styles.historyStat}>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="size-6"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 0 1 2.25-2.25h13.5A2.25 2.25 0 0 1 21 7.5v11.25m-18 0A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75m-18 0v-7.5A2.25 2.25 0 0 1 5.25 9h13.5A2.25 2.25 0 0 1 21 11.25v7.5m-9-6h.008v.008H12v-.008ZM12 15h.008v.008H12V15Zm0 2.25h.008v.008H12v-.008ZM9.75 15h.008v.008H9.75V15Zm0 2.25h.008v.008H9.75v-.008ZM7.5 15h.008v.008H7.5V15Zm0 2.25h.008v.008H7.5v-.008Zm6.75-4.5h.008v.008h-.008v-.008Zm0 2.25h.008v.008h-.008V15Zm0 2.25h.008v.008h-.008v-.008Zm2.25-4.5h.008v.008H16.5v-.008Zm0 2.25h.008v.008H16.5V15Z"
                />
              </svg>
              <h2>
                {data?.history?.filter((item) =>
                  isThisMonth(new Date(item.createdAt))
                ).length || 0}
              </h2>
              <p>This month</p>
            </div>
          </Card>
          <Card className={styles.cardWithBackground}>
            <div className={styles.historyStat}>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="size-6"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M12 6.042A8.967 8.967 0 0 0 6 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 0 1 6 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 0 1 6-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0 0 18 18a8.967 8.967 0 0 0-6 2.292m0-14.25v14.25"
                />
              </svg>
              <h2>
                {data?.history?.filter((item) =>
                  isThisMonth(new Date(item.createdAt))
                ).length || 0}
              </h2>
              <p>Unique hexagrams</p>
            </div>
          </Card>
        </div>

        <div className={styles.historyList}>
          <h1>Recent consultations:</h1>
          {data?.history?.length === 0 ? (
            <p>No history available.</p>
          ) : (
            <ul className={styles.historyItems}>
              {data?.history?.map((item) => {
                const binary = getHexagramByNumber(item.hexagram)?.binary;
                if (!binary) return null;
                const trigrams = getTrigrams(binary || "000000");
                const hexagramData = findHexagram(binary);

                if (!hexagramData) return null;
                if (!trigrams?.lower || !trigrams?.upper) return null;

                return (
                  <li key={item.id} className={styles.historyItem}>
                    <Card className={styles.cardWithBackground}>
                      <CollapsibleContainer
                        title={
                          <div
                            style={{
                              display: "flex",
                              flexDirection: "column",
                              justifyContent: "space-between",
                              alignItems: "flex-start",
                              width: "100%",
                              gap: 16,
                            }}
                          >
                            <h2
                              style={{
                                margin: 0,
                                textAlign: "left",
                                color: "var(--background)",
                                display: "flex",
                                justifyContent: "space-between",
                                width: "100%",
                              }}
                            >
                              {item.intention}
                              <div
                                style={{
                                  margin: 0,
                                  border: "1px solid var(--background)",
                                  backgroundColor: "var(--background)",
                                  padding: 8,
                                  color: "var(--shadow)",
                                  borderRadius: 8,
                                  fontSize: 14,
                                  fontWeight: "lighter",
                                  textTransform: "capitalize",
                                }}
                              >
                                {item.mode.toLowerCase()} toss
                              </div>
                            </h2>

                            <div
                              style={{
                                width: "100%",
                                display: "flex",
                                gap: 16,
                                justifyContent: "flex-start",
                                alignItems: "center",
                                margin: 0,
                              }}
                            >
                              <p
                                style={{
                                  margin: 0,
                                  display: "flex",
                                  alignItems: "center",
                                  gap: 4,
                                  color: "var(--background)",
                                }}
                              >
                                <svg
                                  xmlns="http://www.w3.org/2000/svg"
                                  fill="none"
                                  viewBox="0 0 24 24"
                                  strokeWidth={1.5}
                                  stroke="currentColor"
                                  className="size-6"
                                  style={{ width: "16px", height: "16px" }}
                                >
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 0 1 2.25-2.25h13.5A2.25 2.25 0 0 1 21 7.5v11.25m-18 0A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75m-18 0v-7.5A2.25 2.25 0 0 1 5.25 9h13.5A2.25 2.25 0 0 1 21 11.25v7.5m-9-6h.008v.008H12v-.008ZM12 15h.008v.008H12V15Zm0 2.25h.008v.008H12v-.008ZM9.75 15h.008v.008H9.75V15Zm0 2.25h.008v.008H9.75v-.008ZM7.5 15h.008v.008H7.5V15Zm0 2.25h.008v.008H7.5v-.008Zm6.75-4.5h.008v.008h-.008v-.008Zm0 2.25h.008v.008h-.008V15Zm0 2.25h.008v.008h-.008v-.008Zm2.25-4.5h.008v.008H16.5v-.008Zm0 2.25h.008v.008H16.5V15Z"
                                  />
                                </svg>

                                {format(new Date(item.createdAt), "yyyy-MM-dd")}
                              </p>
                              <p
                                style={{
                                  margin: 0,
                                  display: "flex",
                                  alignItems: "center",
                                  gap: 4,
                                  color: "var(--background)",
                                }}
                              >
                                <svg
                                  xmlns="http://www.w3.org/2000/svg"
                                  fill="none"
                                  viewBox="0 0 24 24"
                                  strokeWidth={1.5}
                                  stroke="currentColor"
                                  className="size-6"
                                  style={{ width: "16px", height: "16px" }}
                                >
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
                                  />
                                </svg>

                                {format(new Date(item.createdAt), "HH:mm")}
                              </p>
                            </div>
                            <div
                              style={{
                                width: "100%",
                                display: "flex",
                                flexDirection: "column",
                                gap: 0,
                                justifyContent: "flex-start",
                                alignItems: "flex-start",
                                margin: 0,
                              }}
                            >
                              <h3>Hexagram received</h3>
                              <p
                                style={{
                                  margin: 0,
                                  color: "var(--background)",
                                  fontSize: 18,
                                  fontWeight: "lighter",
                                }}
                              >
                                {hexagramData.number} - {hexagramData?.name}
                              </p>
                            </div>
                            <div
                              style={{
                                width: "100%",
                                display: "flex",
                                flexDirection: "column",
                                gap: 0,
                                justifyContent: "flex-start",
                                alignItems: "flex-start",
                                margin: 0,
                              }}
                            >
                              <h3>Interpretation</h3>
                              <p
                                style={{
                                  margin: 0,
                                  color: "var(--background)",
                                  fontSize: 14,
                                  textShadow: "0px 0px 2px var(--shadow)",
                                }}
                              >
                                <Markdown>{item.interpretation}</Markdown>
                              </p>
                            </div>
                          </div>
                        }
                      >
                        <div className={styles.hexagramTextWrapper}>
                          <HexagramText
                            hexagram={hexagramData?.binary}
                            trigrams={{
                              lower: trigrams.lower
                                ? { name: trigrams.lower.name }
                                : { name: "" },
                              upper: trigrams.upper
                                ? { name: trigrams.upper.name }
                                : { name: "" },
                            }}
                            hexagramData={hexagramData}
                            hexagramText={
                              hexagramData
                                ? getTranslationKeysForHexagramNumber(
                                    hexagramData.number
                                  )
                                : null
                            }
                            interpretation={{
                              loading: false,
                              error: null,
                              result: item.interpretation,
                            }}
                          />
                        </div>
                      </CollapsibleContainer>
                    </Card>
                  </li>
                );
              })}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
};

export default HistoryPage;
