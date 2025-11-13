export default defineEventHandler(async (event) => {
  const query = getQuery(event);
  const runtimeConfig = useRuntimeConfig();

  if (!query.input) {
    throw createError({
      statusCode: 400,
      statusMessage: "Missing input parameter",
    });
  }

  const url = `https://maps.googleapis.com/maps/api/place/autocomplete/json?input=${encodeURIComponent(
    query.input as string
  )}&key=${runtimeConfig.public.mapsApiKey}`;

  try {
    const response = await $fetch(url);
    return response;
  } catch (error) {
    console.error("Google Places API error:", error);
    throw createError({
      statusCode: 500,
      statusMessage: "Failed to fetch from Google Places API",
    });
  }
});
