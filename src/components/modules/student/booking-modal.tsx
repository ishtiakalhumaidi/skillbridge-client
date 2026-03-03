"use client";

import { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/src/components/ui/dialog";
import { Button } from "@/src/components/ui/button";
import { availabilityService } from "@/src/services/availability.service";
import { bookingService } from "@/src/services/booking.service";
import { toast } from "sonner";
import { CalendarClock } from "lucide-react";

interface BookingModalProps {
  tutorId: string;
  tutorName: string;
  children: React.ReactNode; 
}

export function BookingModal({ tutorId, tutorName, children }: BookingModalProps) {
  const [open, setOpen] = useState(false);
  const [slots, setSlots] = useState<any[]>([]);
  const [loadingSlots, setLoadingSlots] = useState(false);
  const [bookingSlotId, setBookingSlotId] = useState<string | null>(null);

  // Fetch slots only when the modal is opened
  const handleOpenChange = async (isOpen: boolean) => {
    setOpen(isOpen);
    if (isOpen) {
      setLoadingSlots(true);
      const { data, error } = await availabilityService.getTutorAvailability(tutorId);
      if (data) {
        setSlots(data);
      } else {
        toast.error(error?.message || "Could not load availability");
      }
      setLoadingSlots(false);
    }
  };

  const handleBook = async (availabilityId: string) => {
    setBookingSlotId(availabilityId);
    const toastId = toast.loading("Confirming booking...");
    
    const { error } = await bookingService.createBooking({
      tutorId,
      availabilityId,
    });

    setBookingSlotId(null);

    if (error) {
      toast.error(error.message, { id: toastId });
      return;
    }

    toast.success("Session booked successfully!", { id: toastId });
    setOpen(false); // Close the modal on success
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Book a Session</DialogTitle>
          <DialogDescription>
            Select an available time slot with {tutorName}.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          {loadingSlots ? (
            <div className="flex justify-center p-4 text-muted-foreground">Loading time slots...</div>
          ) : slots.length > 0 ? (
            <div className="grid gap-3">
              {slots.map((slot) => (
                <div key={slot.id} className="flex items-center justify-between p-3 border rounded-lg bg-card">
                  <div className="flex items-center gap-3">
                    <CalendarClock className="w-5 h-5 text-primary" />
                    <div>
                      <p className="font-medium text-sm">
                        {slot.dayOfWeek.charAt(0) + slot.dayOfWeek.slice(1).toLowerCase()}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {slot.startTime.slice(0, 5)} - {slot.endTime.slice(0, 5)}
                      </p>
                    </div>
                  </div>
                  <Button 
                    size="sm" 
                    onClick={() => handleBook(slot.id)}
                    disabled={bookingSlotId === slot.id || slot.isBooked}
                    variant={slot.isBooked ? "secondary" : "default"}
                  >
                    {slot.isBooked ? "Booked" : bookingSlotId === slot.id ? "Booking..." : "Book Now"}
                  </Button>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center p-4 border border-dashed rounded-lg text-muted-foreground">
              This tutor has no available time slots right now.
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}