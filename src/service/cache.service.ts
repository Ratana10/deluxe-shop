import { Product } from "@/types";
import Papa from "papaparse";


const CACHE_REVALIDATE_TIME = 3600;


export const getProducts = async (): Promise<Product[]> => {
  try {
    const res = await fetch(`${process.env.SPREADSHEET_DATA_URL}`, {
      cache: "force-cache",
      next: {
        revalidate: CACHE_REVALIDATE_TIME
      }
    });

    if (!res.ok) {
      throw new Error(`Failed to fetch data. Status: ${res.statusText}`);
    }

    const csvData = await res.text();

    const products = await parseCSVToProducts(csvData);

    return products;
  } catch (error: any) {
    throw new Error(`Error fetching or parsing products: ${error.message}`);
  }
};

export const getProductById = async (
  id: string
): Promise<Product | undefined> => {
  const products = await getProducts();

  const product = products.find((pro) => pro.id === id);

  return product;
};

// Utility function to parse CSV into Product[]
const parseCSVToProducts = (csvData: string): Promise<Product[]> => {
  const googleDriveBastUrl = process.env.PUBLIC_DRIVE_URL;

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
                .map((url: string) => `${googleDriveBastUrl}${url.trim()}`)
                .filter(Boolean)
            : [],
        })) as Product[];

        resolve(products);
      },
      error: (error: any) => reject(error),
    });
  });
};
