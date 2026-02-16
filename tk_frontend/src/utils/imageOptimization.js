const CLOUDINARY_UPLOAD_SEGMENT = "/image/upload/";

export const isCloudinaryUrl = (url = "") =>
  typeof url === "string" && url.includes("res.cloudinary.com") && url.includes(CLOUDINARY_UPLOAD_SEGMENT);

export const optimizeImageUrl = (
  url,
  {
    width = 1600,
    quality = "auto:good",
    format = "auto",
    dpr = "auto",
    crop = "limit",
  } = {}
) => {
  if (!url || typeof url !== "string" || !isCloudinaryUrl(url)) {
    return url;
  }

  const [baseUrl, queryString] = url.split("?");
  const transforms = [`f_${format}`, `q_${quality}`, `dpr_${dpr}`];

  if (width) {
    transforms.push(`c_${crop}`, `w_${width}`);
  }

  const optimizedBase = baseUrl.replace(
    CLOUDINARY_UPLOAD_SEGMENT,
    `${CLOUDINARY_UPLOAD_SEGMENT}${transforms.join(",")}/`
  );

  return queryString ? `${optimizedBase}?${queryString}` : optimizedBase;
};

export const getResponsiveImageSet = (url, widths = [480, 768, 1200, 1600]) => {
  if (!isCloudinaryUrl(url)) {
    return undefined;
  }

  return widths
    .map((width) => `${optimizeImageUrl(url, { width })} ${width}w`)
    .join(", ");
};
