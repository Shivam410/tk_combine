import { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { baseUrl } from "../main";
import { services as staticServices } from "../assets/data";

const slugify = (value = "") =>
  value
    .toString()
    .trim()
    .toLowerCase()
    .replace(/&/g, "and")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

const toLink = (slug) => `/${slug}`;

const normalizeApiServices = (apiServices = []) => {
  const staticByName = new Map(
    staticServices.map((item) => [item.service_name.toLowerCase(), item])
  );

  return apiServices.map((service) => {
    const serviceName = service?.serviceName || service?.service_name || "Service";
    const slug = service?.slug || slugify(serviceName);
    const staticMatch = staticByName.get(serviceName.toLowerCase());

    return {
      _id: service?._id,
      service_name: serviceName,
      slug,
      link: toLink(slug),
      img: service?.images?.[0] || staticMatch?.img || staticServices[0]?.img,
      images: service?.images || [],
    };
  });
};

const fetchServices = async () => {
  const { data } = await axios.get(`${baseUrl}/services`);
  return data?.services || [];
};

const useServices = () => {
  const query = useQuery({
    queryKey: ["services-list"],
    queryFn: fetchServices,
    staleTime: 1000 * 60 * 5,
    retry: false,
  });

  const services = useMemo(() => {
    if (query.data?.length) {
      return normalizeApiServices(query.data);
    }

    return staticServices.map((item) => ({
      ...item,
      slug: item.link.replace(/^\//, ""),
    }));
  }, [query.data]);

  return {
    ...query,
    services,
  };
};

export default useServices;
