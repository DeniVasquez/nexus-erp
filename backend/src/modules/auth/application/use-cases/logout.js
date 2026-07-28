export class LogoutUseCase {
  constructor(writeLogEntryUseCase) {
    this.writeLogEntryUseCase = writeLogEntryUseCase;
  }

  async execute({ userId, userName, ipAddress, userAgent }) {
    try {
      await this.writeLogEntryUseCase.execute({
        user: userId,
        action: 'logout',
        resource: 'auth',
        entityId: userId,
        entityModel: 'userModel',
        entityName: userName || 'Usuario',
        details: 'Logout exitoso',
        ipAddress,
        userAgent,
        statusCode: 200,
      });
    } catch (error) {
      console.error('Error creating logout log:', error);
    }
  }
}
