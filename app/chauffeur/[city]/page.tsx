import type { Metadata } from "next";
import { notFound } from "next/navigation";
import {
  getCities,
  getCityBySlug,
  getToursByDestination,
  getTransferRoutesBySlugs,
  getVehicles,
} from "@/lib/data";
import { CityServicePage } from "@/components/cities/city-service-page";
import { JsonLd } from "@/components/shared/json-ld";
import { breadcrumbJsonLd } from "@/lib/structured-data";

type Props = { params: Promise<{ city: string }> };

export async function generateStaticParams() {
  const cities = await getCities();
  return cities.map((c) => ({ city: c.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { city: slug } = await params;
  const city = await getCityBySlug(slug);
  if (!city) return {};

  return {
    title: `Chauffeur Service ${city.name}`,
    description: `Chauffeur-driven executive cars and luxury people carriers in ${city.name}, ${city.province}. Hourly, daily and multi-day hire with vetted professional drivers.`,
    alternates: { canonical: `/chauffeur/${slug}` },
  };
}

export default async function ChauffeurCityPage({ params }: Props) {
  const { city: slug } = await params;
  const city = await getCityBySlug(slug);
  if (!city) notFound();

  const [vehicles, routes, tourLists] = await Promise.all([
    getVehicles({ city: city.name }),
    getTransferRoutesBySlugs(city.transferRouteSlugs),
    Promise.all(city.nearbyDestinationSlugs.map((s) => getToursByDestination(s))),
  ]);

  const crumbs = [
    { label: "Home", href: "/" },
    { label: "Chauffeur Hire", href: "/chauffeur" },
    { label: city.name, href: `/chauffeur/${slug}` },
  ];

  return (
    <>
      <JsonLd data={breadcrumbJsonLd(crumbs)} />
      <CityServicePage
        service="chauffeur"
        city={city}
        vehicles={vehicles}
        routes={routes}
        tours={tourLists.flat()}
      />
    </>
  );
}
