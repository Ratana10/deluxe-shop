import { Metadata } from "next";
import ContactUsClient from "./components/ContactUsClient";


export const metadata: Metadata = {
  title: "Contact Us"
};

const ContactUsPage = () => {
  return <ContactUsClient />
};

export default ContactUsPage;
