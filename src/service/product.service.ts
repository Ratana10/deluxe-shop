import { Product } from "@/types";
import Papa from "papaparse";

// Cache and expiration timestamp
let productCache: Product[] | null = null;
let cacheExpiry: number | null = null;
const CACHE_DURATION_MS = 60 * 60 * 1000; // 1 hour

export const getProducts = async (): Promise<Product[]> => {
  // Check if cache exists and is still valid
  if (productCache && cacheExpiry && Date.now() < cacheExpiry) {
    return productCache;
  }

  try {
    const res = await fetch(`${process.env.SPREADSHEET_DATA_URL}`);

    if (!res.ok) {
      throw new Error(`Failed to fetch data. Status: ${res.statusText}`);
    }

    const csvData = await res.text();

    const products = await parseCSVToProducts(csvData);

    // Cache the parsed products and set an expiry time
    productCache = products;
    cacheExpiry = Date.now() + CACHE_DURATION_MS;

    return products;
  } catch (error: any) {
    throw new Error(`Error fetching or parsing products: ${error.message}`);
  }
};

export const getProductById = async (
  id: string
): Promise<Product | undefined> => {
  if (!productCache) {
    await getProducts(); // Fetch products if cache is empty
  }

  return productCache?.find((pro) => pro.id === id);
};

export const clearProductCache = () => {
  productCache = null;
  cacheExpiry = null;
};

// Utility function to parse CSV into Product[]
const parseCSVToProducts = (csvData: string): Promise<Product[]> => {
  return new Promise((resolve, reject) => {
    Papa.parse<Product>(csvData, {
      header: true,
      skipEmptyLines: true,
      complete: ({ data, errors }) => {
        if (errors.length > 0) {
          return reject(errors);
        }

        // Map the parsed data into Product[]
        const products = data.map((item: any) => ({
          id: item.Id?.toString() || "N/A",
          name: item.Name?.trim() || "Unnamed Product",
          description: item.Description?.trim() || "No description available",
          price: item.Price ? parseFloat(item.Price) : 0.0,
          color: item.Color?.trim(),
          status: item.Status?.trim() || "Unavailable",
          images: item.Images
            ? item.Images.split(",")
                .map((url: string) => url.trim())
                .filter(Boolean)
            : [],
        })) as Product[];

        resolve(products);
      },
      error: (error: any) => reject(error),
    });
  });
};
