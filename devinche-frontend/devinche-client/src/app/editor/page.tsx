'use client';

import DiagramScreen from "../../features/diagram-feature/DiagramScreen";
import ProtectedRoute from "@/components/ProtectedRoute";

export default function EditorPage() {
    return (
            <div style={{ width: "100vw", height: "100vh" }}>
                <DiagramScreen />
            </div>
    );
}