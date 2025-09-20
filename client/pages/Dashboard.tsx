import { useEffect, useMemo, useState } from "react";
import GooglePlacesMap from "@/components/maps/GooglePlacesMap";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import type { Appointment, Centre, Patient } from "@shared/api";
import { format } from "date-fns";

export default function Dashboard() {
  const [patient, setPatient] = useState<Patient | null>(null);
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [selected, setSelected] = useState<Centre | null>(null);
  const [date, setDate] = useState<string>("");
  const [time, setTime] = useState<string>("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetch("/api/patient").then((r) => r.json()).then(setPatient);
    fetch("/api/appointments").then((r) => r.json()).then(setAppointments);
  }, []);

  async function book() {
    if (!selected || !patient || !date || !time) return;
    setSubmitting(true);
    const res = await fetch("/api/appointments", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        centre: selected,
        patientId: patient.id,
        slotISO: new Date(`${date}T${time}:00`).toISOString(),
      }),
    });
    const appt = (await res.json()) as Appointment;
    setAppointments((a) => [appt, ...a]);
    setSubmitting(false);
    setSelected(null);
    setDate("");
    setTime("");
  }

  return (
    <div className="container py-10 space-y-10">
      <section className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Welcome{patient ? `, ${patient.firstName}` : ""}</CardTitle>
          </CardHeader>
          <CardContent>
            {patient && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div>
                  <div className="text-foreground/60">Email</div>
                  <div className="font-medium">{patient.email}</div>
                </div>
                <div>
                  <div className="text-foreground/60">Phone</div>
                  <div className="font-medium">{patient.phone}</div>
                </div>
                <div>
                  <div className="text-foreground/60">DOB</div>
                  <div className="font-medium">{patient.dob}</div>
                </div>
                <div>
                  <div className="text-foreground/60">Blood Group</div>
                  <div className="font-medium">{patient.medical.bloodGroup}</div>
                </div>
                <div className="md:col-span-2">
                  <div className="text-foreground/60">Address</div>
                  <div className="font-medium">{patient.address}</div>
                </div>
                <div className="md:col-span-2">
                  <div className="text-foreground/60">Conditions</div>
                  <div className="font-medium">{patient.medical.conditions.join(", ")}</div>
                </div>
                <div className="md:col-span-2">
                  <div className="text-foreground/60">Allergies</div>
                  <div className="font-medium">{patient.medical.allergies.join(", ")}</div>
                </div>
                <div className="md:col-span-2">
                  <div className="text-foreground/60">Medications</div>
                  <div className="font-medium">{patient.medical.medications.join(", ")}</div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Upcoming Appointments</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {appointments.length === 0 && (
              <div className="text-sm text-foreground/60">No appointments booked yet.</div>
            )}
            {appointments.map((a) => (
              <div key={a.id} className="rounded-lg border p-3">
                <div className="font-medium">{a.centre.name}</div>
                <div className="text-sm text-foreground/70">{a.centre.address}</div>
                <div className="mt-1 text-sm font-medium">
                  {format(new Date(a.slotISO), "EEE, dd MMM yyyy p")}
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </section>

      <section id="centres" className="space-y-4">
        <div>
          <h2 className="text-xl font-semibold">Find Panchakarma Centres</h2>
          <p className="text-sm text-foreground/70">Search nearby centres and book an appointment.</p>
        </div>
        <GooglePlacesMap onSelectCentre={(c) => setSelected(c)} />
      </section>

      <Dialog open={!!selected} onOpenChange={(o) => !o && setSelected(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Book Appointment</DialogTitle>
          </DialogHeader>
          {selected && (
            <div className="space-y-3">
              <div className="text-sm">
                <div className="font-medium">{selected.name}</div>
                <div className="text-foreground/70">{selected.address}</div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div>
                  <Label htmlFor="date">Date</Label>
                  <Input id="date" type="date" value={date} onChange={(e) => setDate(e.target.value)} />
                </div>
                <div>
                  <Label htmlFor="time">Time</Label>
                  <Input id="time" type="time" value={time} onChange={(e) => setTime(e.target.value)} />
                </div>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="secondary" onClick={() => setSelected(null)}>Cancel</Button>
            <Button onClick={book} disabled={!date || !time || submitting}>
              {submitting ? "Booking..." : "Confirm Booking"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
