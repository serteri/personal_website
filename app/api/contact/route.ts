import {NextResponse} from "next/server";
import {Resend} from "resend";
import {z} from "zod";
import { supabase } from '@/lib/supabaseClient'; // Supabase client'ı import ediyoruz

//Zod ile gelen verinin semasini (kurallarini) belirtiyoruz
const contactFormSchema=z.object({
firstName:z.string().min(2,"First name must be at least 2 characters."),
lastName:z.string().min(2,"Last name must be at least 2 characters."),
    email:z.string().email("Invalid email address"),
    phone:z.string().min(5,"Phone number is too short"),
    countryCode:z.string(),
    message:z.string().min(10,"Message must be at least 10 characters.").max(1000)


})

// API anahtarının .env.local dosyasından gelip gelmediğini kontrol edelim.
const apiKey = process.env.RESEND_API_KEY;
if (!apiKey) {
    throw new Error("Resend API Key is not set in environment variables.");
}
// Resend'i doğrulanmış anahtarla başlatalım.
const resend = new Resend(apiKey);

export async function POST(req:Request) {
    try {
        const body = await req.json();
        //Gelen veriyi Zod semasi ile dogruluyoruz
        const validateData = contactFormSchema.parse(body);
        const {firstName, lastName, email, phone, countryCode, message} = validateData;

        // --- YENİ: VERİTABANINA KAYDETME KODU ---
        const { data: dbData, error: dbError } = await supabase
            .from('contacts') // Tablo adımız
            .insert([
                {
                    first_name: firstName,
                    last_name: lastName,
                    email,
                    country_code: countryCode,
                    phone,
                    message
                }
            ]);

            // Veritabanı hatası varsa, işlemi durdur ve hata döndür
        if (dbError) {
            console.error('Supabase Error:', dbError);
            return NextResponse.json({ message: 'Database error', error: dbError.message }, { status: 500 });
        }
        //Resend ile email gönderiyoruz

        const {data, error} = await resend.emails.send({
            from: 'Contact Form <onboarding@resend.dev>',
            to: ['serteri@hotmail.com'],
            subject: `New contact form submission from ${firstName} ${lastName}`,
            html: `
            <p>You received a new message from your website's contact form:</p>
            <ul>
            <li><strong>Name:</strong>${firstName}${lastName}</li>
            <li><strong>Email:</strong>${email}</li>
            <li><strong>Phone:</strong>${countryCode} ${phone}</li>
            </ul>
            <p><strong>Message:</strong></p>
            <p>${message}</p>
                `
        })

        if (error) {
            console.log("Resend error:", error);
            return NextResponse.json({message: 'error sending email'}, {status: 500});
        }
        return NextResponse.json({message: 'Form submitted successfully!', data}, {status: 200});
    }
    catch(err) {
        console.error("Validation error:", err);
        if (err instanceof z.ZodError) {
            return NextResponse.json({message: 'Validation failed', errors: err.errors}, {status: 400});
        }
        return NextResponse.json({message: 'Internal server error'}, {status: 500});
    }


}
