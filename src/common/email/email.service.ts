import { Injectable } from '@nestjs/common';
import { User } from 'src/models/users/entities/user.entity';

export interface EmailOptions {
  to: string;
  subject: string;
  html: string;
}

@Injectable()
export class EmailService {
  async sendRestorePassword(user: User) {
    // Todo: replace usuario for first and last name
    const emailOptions: EmailOptions = {
      to: user.email,
      subject: 'Restaurar Contraseña',
      html: `<h1>Restaurar Contraseña</h1>
      <p>Estimado usuario,</p>
      <p>Para restaurar su contraseña, haga click en el botón debajo.</p>
      <a href="${process.env.BASE_URL}/restore-password/${user.id}" target="_blank" type='button'>Restaurar Contraseña</a>`,
    };

    await this.sendEmail(emailOptions);
  }

  private async sendEmail(data: EmailOptions) {
    const { to, subject, html } = data;

    // todo: replace with actual logger
    // console.log(
    //   `Sending email to ${to} with subject ${subject} and html ${html}`,
    // );

    await Promise.resolve();
  }
}
