"use client";
import React, { useState, createContext, useContext } from "react";
import type { SectionName } from "@/lib/types";

type ActiveSectionContextProps = {
    children: React.ReactNode;
};
export const ActiveSectionContext =
    createContext<ActiveSectionContextType | null>(null);
type ActiveSectionContextType = {
    activeSection: SectionName;
    setActiveSection: React.Dispatch<React.SetStateAction<SectionName>>;
    timeOfLastClick: number;
    setTimeOfLastClick: React.Dispatch<React.SetStateAction<number>>;
};
export default function ActiveSectionContextProvider({
                                                         children,
                                                     }: ActiveSectionContextProps) {
    const [activeSection, setActiveSection] = useState<SectionName>("Home");
    const [timeOfLastClick, setTimeOfLastClick] = useState<number>(0); //we need to keep track of this to disable the observer
    return (
        <ActiveSectionContext.Provider
            value={{
                activeSection,
                setActiveSection,
                timeOfLastClick,
                setTimeOfLastClick,
            }}
        >
            {children}
        </ActiveSectionContext.Provider>
    );
}

export function useActiveSectionContext() {
    const context = useContext(ActiveSectionContext);
    if (context === null) {
        throw new Error(
            "useActiveSection must be used within a ActiveSectionContextProvider",
        );
    }
    return context;
}
