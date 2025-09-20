import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  HeartPulse,
  Leaf,
  ShieldCheck,
  Stethoscope,
  MapPin,
} from "lucide-react";

export default function Index() {
  return (
    <div className="">
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(16,185,129,0.15),transparent_60%)]" />
        <div className="container relative py-20">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full border bg-white/70 px-3 py-1 text-xs font-medium text-foreground/80 backdrop-blur">
                <Leaf className="h-3.5 w-3.5 text-primary" /> Ayurveda •
                Panchakarma • Wellness
              </div>
              <h1 className="mt-4 text-4xl md:text-5xl font-extrabold tracking-tight leading-tight">
                Ayursutra — Holistic healing, personalised for you
              </h1>
              <p className="mt-4 text-foreground/70 max-w-xl">
                Your one place to manage health records, explore Panchakarma
                centres, and book appointments with ease.
              </p>
              <div className="mt-6 flex flex-wrap gap-3">
                <Button asChild size="lg" className="gap-2">
                  <Link to="/dashboard">
                    <Stethoscope className="h-5 w-5" /> Patient Dashboard
                  </Link>
                </Button>
                <Button asChild variant="secondary" size="lg" className="gap-2">
                  <a href="#features">
                    <ShieldCheck className="h-5 w-5" /> Secure & Private
                  </a>
                </Button>
              </div>
            </div>
            <div className="lg:pl-10">
              <Card>
                <CardContent className="p-0">
                  <img
                    src="/placeholder.svg"
                    alt="Ayurvedic therapy"
                    className="h-[340px] w-full object-cover"
                  />
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      <section id="features" className="border-t bg-white/60">
        <div className="container py-14 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="rounded-xl border p-6">
            <HeartPulse className="h-8 w-8 text-primary" />
            <h3 className="mt-3 font-semibold">Personal health vault</h3>
            <p className="text-sm text-foreground/70 mt-1">
              All your personal details and medical history in one secure place.
            </p>
          </div>
          <div className="rounded-xl border p-6">
            <MapPin className="h-8 w-8 text-primary" />
            <h3 className="mt-3 font-semibold">Find nearby centres</h3>
            <p className="text-sm text-foreground/70 mt-1">
              Discover Panchakarma centres around you with integrated Google
              Maps.
            </p>
          </div>
          <div className="rounded-xl border p-6">
            <ShieldCheck className="h-8 w-8 text-primary" />
            <h3 className="mt-3 font-semibold">Privacy-first</h3>
            <p className="text-sm text-foreground/70 mt-1">
              Your records stay encrypted and private on your device and our
              servers.
            </p>
          </div>
        </div>
      </section>

      <section className="bg-gradient-to-br from-emerald-50 to-white">
        <div className="container py-16">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            <div>
              <h2 className="text-2xl font-bold">
                Ready to begin your wellness journey?
              </h2>
              <p className="text-sm text-foreground/70 mt-2">
                Access your dashboard to view your details and book an
                appointment.
              </p>
            </div>
            <div className="md:text-right">
              <Button asChild size="lg" className="gap-2">
                <Link to="/dashboard">
                  <Stethoscope className="h-5 w-5" /> Go to Dashboard
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
