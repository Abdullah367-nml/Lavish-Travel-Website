import type { Metadata } from "next";
import { notFound } from "next/navigation";
import {
  getCities,
  getCityBySlug,
  getSelfDriveVehicles,
  getToursByDestination,
  getTransferRoutesBySlugs,
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
    title: `Luxury Car Hire ${city.name}`,
    description: `Self-drive luxury car and 4x4 rental in ${city.name}, ${city.province}. Comprehensive insurance, unlimited-kilometre options, delivered to your hotel or ${city.airportCode}.`,
    alternates: { canonical: `/car-hire/${slug}` },
  };
}

export default async function CarHireCityPage({ params }: Props) {
  const { city: slug } = await params;
  const city = await getCityBySlug(slug);
  if (!city) notFound();

  const [vehicles, routes, tourLists] = await Promise.all([
    // Only vehicles the customer can actually drive themselves.
    getSelfDriveVehicles(city.name),
    getTransferRoutesBySlugs(city.transferRouteSlugs),
    Promise.all(city.nearbyDestinationSlugs.map((s) => getToursByDestination(s))),
  ]);

  const crumbs = [
    { label: "Home", href: "/" },
    { label: "Car Hire", href: "/car-hire" },
    { label: city.name, href: `/car-hire/${slug}` },
  ];

  return (
    <>
      <JsonLd data={breadcrumbJsonLd(crumbs)} />
      <CityServicePage
        service="car-hire"
        city={city}
        vehicles={vehicles}
        routes={routes}
        tours={tourLists.flat()}
      />
    </>
  );
}
