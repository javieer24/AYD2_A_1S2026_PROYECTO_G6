const mockSendMail = jest.fn().mockResolvedValue({ messageId: 'test-message' });
const mockGet = jest.fn();

jest.mock('../src/config/mailer', () => ({
  sendMail: mockSendMail
}));

jest.mock('../src/config/serviceClient', () => ({
  createServiceClient: () => ({ get: mockGet })
}));

jest.mock('../src/config/env', () => ({
  appUrl: 'http://localhost',
  universidades: {
    USAC: 'coordinador@usac.edu.gt'
  },
  services: {
    authUrl: 'http://auth-service:3001'
  }
}));

const { handleCertificadoEmitido } = require('../src/handlers/certificadoEmitido.handler');

describe('handleCertificadoEmitido', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockGet.mockResolvedValue({
      data: {
        nombre_completo: 'Luis Fernando Gomez Rendon',
        email: 'luis@example.com',
        universidad_origen: 'USAC'
      }
    });
  });

  test('notifica al candidato y al coordinador con enlace publico de verificacion', async () => {
    await handleCertificadoEmitido({
      id_certificado: 'CERT-001',
      id_candidato: 'USAC-2026-001',
      hash_documento: 'abc123',
      sesion_examen_id: 15
    });

    expect(mockGet).toHaveBeenCalledWith(
      'http://auth-service:3001/api/auth/candidatos/USAC-2026-001'
    );

    expect(mockSendMail).toHaveBeenCalledTimes(2);
    expect(mockSendMail).toHaveBeenNthCalledWith(1, expect.objectContaining({
      to: 'luis@example.com',
      subject: expect.stringContaining('certificado PRCCD'),
      html: expect.stringContaining('http://localhost/api/certificate/verificar/CERT-001')
    }));
    expect(mockSendMail).toHaveBeenNthCalledWith(2, expect.objectContaining({
      to: 'coordinador@usac.edu.gt',
      subject: expect.stringContaining('USAC'),
      html: expect.stringContaining('USAC-2026-001')
    }));
  });
});
