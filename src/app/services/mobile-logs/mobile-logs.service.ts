import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class MobileLogsService {
  private apiUrl = 'https://192.168.1.14:444/logs'; // Endpoint do servidor NestJS

  constructor(private http: HttpClient) {}

  sendLog(context: any, log: any): void {
    console.log('Tentativa de log:', context, log);
    this.http.post(this.apiUrl, { context, log }).subscribe({
      next: (response) => console.log('Log enviado com sucesso:', response),
      error: (err) => {
        console.error('Erro ao enviar log:', context, err);
        alert(`Erro ao enviar log: ${context} ${log} ${err.message}`);
      },
    });
  }
}
