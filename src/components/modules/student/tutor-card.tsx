"use client";

import { Button } from "@/src/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/src/components/ui/card";
import { Badge } from "@/src/components/ui/badge";
import { UserCircle } from "lucide-react";
import { BookingModal } from "@/src/components/modules/student/booking-modal";

interface Tutor {
  id: string;
  bio: string;
  hourlyRate: number;
  user: {
    name: string;
  };
}

export function TutorCard({ tutor }: { tutor: Tutor }) {
  const tutorName = tutor.user?.name || "Anonymous Tutor";

  return (
    <Card className="flex flex-col h-full shadow-sm hover:shadow-md transition-shadow">
      <CardHeader className="flex flex-row items-center gap-4 pb-2">
        <UserCircle className="w-12 h-12 text-muted-foreground" />
        <div className="flex flex-col">
          <CardTitle className="text-xl">{tutorName}</CardTitle>
          <Badge variant="secondary" className="w-fit mt-1">
            ${tutor.hourlyRate}/hr
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="flex-1 mt-2">
        <p className="text-sm text-muted-foreground line-clamp-3">
          {tutor.bio || "No bio provided."}
        </p>
      </CardContent>
      <CardFooter>
        {/* We wrap the button with our new Booking Modal! */}
        <BookingModal tutorId={tutor.id} tutorName={tutorName}>
          <Button className="w-full">
            View Availability & Book
          </Button>
        </BookingModal>
      </CardFooter>
    </Card>
  );
}