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
import React, { useEffect, useState } from "react";

interface HistoryItem {
  id: string;
  createdAt: string;
  intention: string;
  hexagram: number;
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
      <div style={{ padding: "20px" }}>
        <h1>User History</h1>
        <Spinner />
      </div>
    );
  }

  return (
    <div style={{ padding: "20px" }}>
      <h1>User History</h1>
      {data?.history?.length === 0 ? (
        <p>No history available.</p>
      ) : (
        <ul>
          {data?.history?.map((item) => {
            const binary = getHexagramByNumber(item.hexagram)?.binary;
            if (!binary) return null;
            const trigrams = getTrigrams(binary || "000000");
            const hexagramData = findHexagram(binary);

            if (!hexagramData) return null;
            if (!trigrams?.lower || !trigrams?.upper) return null;

            return (
              <li
                key={item.id}
                style={{
                  marginBottom: "10px",
                  listStyleType: "none",
                }}
              >
                <Card>
                  <CollapsibleContainer
                    title={
                      <>
                        <h4>{format(new Date(item.createdAt), "PPPpp")}</h4>
                        <p>{item.intention}</p>
                      </>
                    }
                  >
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
                    />
                  </CollapsibleContainer>
                </Card>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
};

export default HistoryPage;
