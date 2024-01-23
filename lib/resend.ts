import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

resend.apiKeys.create({ name: "Production" });

export default resend;
