import { Product } from "@/types";
import Papa from "papaparse";

export const getProducts = async (): Promise<Product[]> => {
  const res = await fetch(`${process.env.SPREADSHEET_DATA_URL}`, {
    cache: "default",
  });

  if (!res.ok) {
    throw new Error("Cannot fetch data");
  }

  const csvData = await res.text();

  return new Promise((resolve, reject) => {
    Papa.parse<Product>(csvData, {
      header: true,
      complete: (result) => {
        if (result.errors.length > 0) {
          reject(result.errors);
        } else {
          const products = result.data.map((item: any) => ({
            id: item.Id,
            name: item.Name,
            description: item.Description,
            price: parseFloat(item.Price),
            status: item.Status,
            images: item.Images
              ? item.Images.split(",")
                  .map((url: string) => url.trim())
                  .filter((url: string) => !!url)
              : [],
          })) as Product[];

          resolve(products);
        }
      },
      error: (error: any) => reject(error),
    });
  });
};

export const getProductById = async (
  id: string
): Promise<Product | undefined> => {
  const products = await getProducts();

  return products.find((pro) => pro.id === id);
};
