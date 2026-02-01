import { prisma } from "./prisma";
import { ActorType, Prisma } from "@prisma/client";

export type EntityType =
  | "BOOKING"
  | "PAYMENT_PROOF"
  | "CALENDAR_SLOT"
  | "SERVICE"
  | "PACKAGE"
  | "ADMIN";

export type ActionType =
  | "CREATED"
  | "UPDATED"
  | "DELETED"
  | "STATUS_CHANGED"
  | "VERIFIED"
  | "REJECTED"
  | "CANCELLED"
  | "UPLOADED"
  | "DOWNLOADED"
  | "LOGIN"
  | "LOGOUT";

export interface AuditLogInput {
  // Actor information
  actorType: ActorType;
  actorId?: string;
  actorName?: string;

  // Target entity
  entityType: EntityType;
  entityId: string;

  // Action details
  action: ActionType;
  oldValues?: Prisma.InputJsonValue;
  newValues?: Prisma.InputJsonValue;

  // Request metadata
  ipAddress?: string;
  userAgent?: string;
}

/**
 * Create an audit log entry
 */
export async function createAuditLog(input: AuditLogInput): Promise<void> {
  try {
    await prisma.auditLog.create({
      data: {
        actorType: input.actorType,
        actorId: input.actorId,
        actorName: input.actorName,
        entityType: input.entityType,
        entityId: input.entityId,
        action: input.action,
        oldValues: input.oldValues ?? Prisma.JsonNull,
        newValues: input.newValues ?? Prisma.JsonNull,
        ipAddress: input.ipAddress,
        userAgent: input.userAgent,
      },
    });
  } catch (error) {
    // Log error but don't throw - audit logging should not break the main flow
    console.error("Failed to create audit log:", error);
  }
}

/**
 * Log booking status change
 */
export async function logBookingStatusChange(
  bookingId: string,
  oldStatus: string,
  newStatus: string,
  actor: { type: ActorType; id?: string; name?: string },
  metadata?: { ipAddress?: string; userAgent?: string }
): Promise<void> {
  await createAuditLog({
    actorType: actor.type,
    actorId: actor.id,
    actorName: actor.name,
    entityType: "BOOKING",
    entityId: bookingId,
    action: "STATUS_CHANGED",
    oldValues: { status: oldStatus },
    newValues: { status: newStatus },
    ipAddress: metadata?.ipAddress,
    userAgent: metadata?.userAgent,
  });
}

/**
 * Log payment verification
 */
export async function logPaymentVerification(
  paymentProofId: string,
  action: "VERIFIED" | "REJECTED",
  adminId: string,
  adminName: string,
  details?: { reason?: string },
  metadata?: { ipAddress?: string; userAgent?: string }
): Promise<void> {
  await createAuditLog({
    actorType: "ADMIN",
    actorId: adminId,
    actorName: adminName,
    entityType: "PAYMENT_PROOF",
    entityId: paymentProofId,
    action,
    newValues: details ? { ...details } : undefined,
    ipAddress: metadata?.ipAddress,
    userAgent: metadata?.userAgent,
  });
}

/**
 * Log file upload
 */
export async function logFileUpload(
  bookingId: string,
  paymentProofId: string,
  clientName: string,
  metadata?: { ipAddress?: string; userAgent?: string }
): Promise<void> {
  await createAuditLog({
    actorType: "CLIENT",
    actorName: clientName,
    entityType: "PAYMENT_PROOF",
    entityId: paymentProofId,
    action: "UPLOADED",
    newValues: { bookingId },
    ipAddress: metadata?.ipAddress,
    userAgent: metadata?.userAgent,
  });
}

/**
 * Log calendar slot change
 */
export async function logCalendarSlotChange(
  slotId: string,
  oldStatus: string,
  newStatus: string,
  actor: { type: ActorType; id?: string; name?: string },
  details?: { bookingId?: string; blockedReason?: string },
  metadata?: { ipAddress?: string; userAgent?: string }
): Promise<void> {
  await createAuditLog({
    actorType: actor.type,
    actorId: actor.id,
    actorName: actor.name,
    entityType: "CALENDAR_SLOT",
    entityId: slotId,
    action: "STATUS_CHANGED",
    oldValues: { status: oldStatus },
    newValues: { status: newStatus, ...details },
    ipAddress: metadata?.ipAddress,
    userAgent: metadata?.userAgent,
  });
}

/**
 * Log admin login
 */
export async function logAdminLogin(
  adminId: string,
  adminEmail: string,
  metadata?: { ipAddress?: string; userAgent?: string }
): Promise<void> {
  await createAuditLog({
    actorType: "ADMIN",
    actorId: adminId,
    actorName: adminEmail,
    entityType: "ADMIN",
    entityId: adminId,
    action: "LOGIN",
    ipAddress: metadata?.ipAddress,
    userAgent: metadata?.userAgent,
  });
}

/**
 * Get audit logs for an entity
 */
export async function getAuditLogs(
  entityType: EntityType,
  entityId: string,
  limit: number = 50
) {
  return prisma.auditLog.findMany({
    where: {
      entityType,
      entityId,
    },
    orderBy: {
      createdAt: "desc",
    },
    take: limit,
  });
}

/**
 * Get recent audit logs (for admin dashboard)
 */
export async function getRecentAuditLogs(limit: number = 100) {
  return prisma.auditLog.findMany({
    orderBy: {
      createdAt: "desc",
    },
    take: limit,
    include: {
      admin: {
        select: {
          name: true,
          email: true,
        },
      },
    },
  });
}
