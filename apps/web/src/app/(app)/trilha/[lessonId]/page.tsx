import { mockLessonDetails } from "@/lib/mock-data";
import { LessonPageClient } from "./LessonPageClient";

export function generateStaticParams() {
    return Object.keys(mockLessonDetails).map((lessonId) => ({ lessonId }));
}

export default function LessonPage() {
    return <LessonPageClient />;
}
