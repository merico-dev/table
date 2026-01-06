import { MigrationInterface, QueryRunner } from 'typeorm';

// Migration disabled - citext extension no longer needed
export class addExtensionCitext1660005273691 implements MigrationInterface {
  public async up(): Promise<void> {
    // No-op: citext extension removed
  }

  public async down(): Promise<void> {
    // No-op
  }
}
