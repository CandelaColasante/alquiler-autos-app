package com.alquiler.autos.service;

import com.alquiler.autos.dto.ReservationResponseDTO;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;

import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;

@Service
public class EmailService {

    @Autowired
    private JavaMailSender mailSender;

    @Value("${spring.mail.username}")
    private String fromEmail;

    public void sendReservationConfirmation(String toEmail, String userName, ReservationResponseDTO reservation) {
        if (toEmail == null || toEmail.isEmpty() || fromEmail == null || fromEmail.isEmpty()) {
            throw new RuntimeException("Configuración de email no disponible");
        }

        try {
            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");

            helper.setFrom(fromEmail);
            helper.setTo(toEmail);
            helper.setSubject("¡Reserva confirmada! - Ready 2 Go");

            String html = buildEmailHtml(userName, reservation);
            helper.setText(html, true);

            mailSender.send(message);
        } catch (MessagingException e) {
            System.err.println("Error al enviar email: " + e.getMessage());
            throw new RuntimeException("Error al enviar email: " + e.getMessage());
        }
    }

    private String buildEmailHtml(String userName, ReservationResponseDTO reservation) {
        return """
            <!DOCTYPE html>
            <html>
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
            </head>
            <body style="margin:0; padding:0; background-color:#f8f9ff; font-family:Arial,sans-serif;">
                <table width="100%%" cellpadding="0" cellspacing="0" style="background-color:#f8f9ff; padding:40px 20px;">
                    <tr>
                        <td align="center">
                            <table width="600" cellpadding="0" cellspacing="0" style="background-color:white; border-radius:16px; overflow:hidden; box-shadow:0 4px 12px rgba(0,0,0,0.1);">
                                
                                <!-- Header -->
                                <tr>
                                    <td style="background-color:#424790; padding:32px; text-align:center;">
                                        <h1 style="color:white; margin:0; font-size:28px;">Ready 2 Go</h1>
                                        <p style="color:#dee4ff; margin:8px 0 0 0; font-size:14px;">Viajá cómodo y seguro</p>
                                    </td>
                                </tr>

                                <!-- Título -->
                                <tr>
                                    <td style="padding:32px 40px 0 40px; text-align:center;">
                                        <div style="font-size:48px;">✅</div>
                                        <h2 style="color:#424790; margin:16px 0 8px 0;">¡Reserva confirmada!</h2>
                                        <p style="color:#666; margin:0; font-size:15px;">Hola <strong>%s</strong>, tu reserva fue realizada con éxito.</p>
                                    </td>
                                </tr>

                                <!-- Detalles -->
                                <tr>
                                    <td style="padding:32px 40px;">
                                        <table width="100%%" cellpadding="0" cellspacing="0" style="background-color:#f8f9ff; border-radius:12px; overflow:hidden;">
                                            <tr>
                                                <td style="padding:20px; border-bottom:1px solid #dee4ff;">
                                                    <p style="margin:0; font-size:11px; color:#424790; font-weight:bold; text-transform:uppercase; letter-spacing:0.5px;">Vehículo</p>
                                                    <p style="margin:4px 0 0 0; font-size:18px; color:#333; font-weight:bold;">%s</p>
                                                </td>
                                            </tr>
                                            <tr>
                                                <td style="padding:20px; border-bottom:1px solid #dee4ff;">
                                                    <p style="margin:0; font-size:11px; color:#424790; font-weight:bold; text-transform:uppercase; letter-spacing:0.5px;">Fecha de inicio</p>
                                                    <p style="margin:4px 0 0 0; font-size:16px; color:#333;">%s</p>
                                                </td>
                                            </tr>
                                            <tr>
                                                <td style="padding:20px; border-bottom:1px solid #dee4ff;">
                                                    <p style="margin:0; font-size:11px; color:#424790; font-weight:bold; text-transform:uppercase; letter-spacing:0.5px;">Fecha de fin</p>
                                                    <p style="margin:4px 0 0 0; font-size:16px; color:#333;">%s</p>
                                                </td>
                                            </tr>
                                            <tr>
                                                <td style="padding:20px;">
                                                    <p style="margin:0; font-size:11px; color:#424790; font-weight:bold; text-transform:uppercase; letter-spacing:0.5px;">Número de reserva</p>
                                                    <p style="margin:4px 0 0 0; font-size:16px; color:#333;">#%s</p>
                                                </td>
                                            </tr>
                                        </table>
                                    </td>
                                </tr>

                                <!-- Contacto -->
                                <tr>
                                    <td style="padding:0 40px 32px 40px;">
                                        <table width="100%%" cellpadding="0" cellspacing="0" style="background-color:#eb5200; border-radius:12px;">
                                            <tr>
                                                <td style="padding:20px;">
                                                    <p style="margin:0; color:white; font-weight:bold; font-size:15px;">¿Tenés alguna consulta?</p>
                                                    <p style="margin:8px 0 0 0; color:rgba(255,255,255,0.9); font-size:13px;">Comunicate con nosotros por WhatsApp: <strong>+54 9 11 0000-0000</strong></p>
                                                    <p style="margin:4px 0 0 0; color:rgba(255,255,255,0.9); font-size:13px;">O respondé este correo y te ayudamos.</p>
                                                </td>
                                            </tr>
                                        </table>
                                    </td>
                                </tr>

                                <!-- Footer -->
                                <tr>
                                    <td style="background-color:#424790; padding:20px; text-align:center;">
                                        <p style="color:#dee4ff; margin:0; font-size:12px;">© 2026 Ready 2 Go. Todos los derechos reservados.</p>
                                        <p style="color:rgba(255,255,255,0.5); margin:4px 0 0 0; font-size:11px;">Este correo fue enviado automáticamente, por favor no respondas directamente.</p>
                                    </td>
                                </tr>

                            </table>
                        </td>
                    </tr>
                </table>
            </body>
            </html>
            """.formatted(
                userName,
                reservation.getProductName(),
                reservation.getStartDate().toString(),
                reservation.getEndDate().toString(),
                reservation.getId().toString()
        );
    }
}