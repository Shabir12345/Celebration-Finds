"use client";

import { useState, useCallback } from "react";
import { PortfolioEvent } from "@/types/portfolio";

export function useEventModal() {
  const [selectedEvent, setSelectedEvent] = useState<PortfolioEvent | null>(null);

  const openModal = useCallback((event: PortfolioEvent) => {
    setSelectedEvent(event);
    // Prevent body scroll
    document.body.style.overflow = "hidden";
  }, []);

  const closeModal = useCallback(() => {
    setSelectedEvent(null);
    document.body.style.overflow = "";
  }, []);

  return { selectedEvent, isOpen: selectedEvent !== null, openModal, closeModal };
}
