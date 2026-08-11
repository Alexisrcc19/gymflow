-- CreateEnum
CREATE TYPE "GymStatus" AS ENUM ('ACTIVE', 'INACTIVE');

-- CreateEnum
CREATE TYPE "UserRole" AS ENUM ('ADMIN', 'TRAINER', 'MEMBER');

-- CreateEnum
CREATE TYPE "UserStatus" AS ENUM ('ACTIVE', 'INACTIVE');

-- CreateEnum
CREATE TYPE "ProfileStatus" AS ENUM ('ACTIVE', 'INACTIVE');

-- CreateEnum
CREATE TYPE "AssignmentStatus" AS ENUM ('ACTIVE', 'INACTIVE');

-- CreateEnum
CREATE TYPE "MembershipPlanStatus" AS ENUM ('ACTIVE', 'INACTIVE');

-- CreateEnum
CREATE TYPE "DurationUnit" AS ENUM ('DAY', 'MONTH');

-- CreateEnum
CREATE TYPE "MembershipStatus" AS ENUM ('PENDING', 'ACTIVE', 'EXPIRED', 'CANCELLED');

-- CreateEnum
CREATE TYPE "AttendanceSource" AS ENUM ('ADMIN', 'TRAINER', 'SYSTEM');

-- CreateEnum
CREATE TYPE "RoutineStatus" AS ENUM ('DRAFT', 'ACTIVE', 'ARCHIVED');

-- CreateEnum
CREATE TYPE "RoutineVersionStatus" AS ENUM ('DRAFT', 'PUBLISHED');

-- CreateEnum
CREATE TYPE "PrescriptionType" AS ENUM ('REPETITIONS', 'DURATION');

-- CreateEnum
CREATE TYPE "WeightUnit" AS ENUM ('KG', 'LB');

-- CreateEnum
CREATE TYPE "RoutineAssignmentStatus" AS ENUM ('PENDING', 'ACTIVE', 'COMPLETED', 'CANCELLED');

-- CreateTable
CREATE TABLE "Gym" (
    "id" UUID NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "timezone" TEXT NOT NULL DEFAULT 'America/Guayaquil',
    "currency" VARCHAR(3) NOT NULL DEFAULT 'USD',
    "status" "GymStatus" NOT NULL DEFAULT 'ACTIVE',
    "createdAt" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMPTZ(3) NOT NULL,

    CONSTRAINT "Gym_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "GymCodeSequence" (
    "gymId" UUID NOT NULL,
    "nextMemberNumber" INTEGER NOT NULL DEFAULT 1,
    "nextTrainerNumber" INTEGER NOT NULL DEFAULT 1,
    "updatedAt" TIMESTAMPTZ(3) NOT NULL,

    CONSTRAINT "GymCodeSequence_pkey" PRIMARY KEY ("gymId")
);

-- CreateTable
CREATE TABLE "User" (
    "id" UUID NOT NULL,
    "gymId" UUID NOT NULL,
    "email" TEXT NOT NULL,
    "passwordHash" TEXT NOT NULL,
    "role" "UserRole" NOT NULL,
    "status" "UserStatus" NOT NULL DEFAULT 'ACTIVE',
    "emailVerifiedAt" TIMESTAMPTZ(3),
    "lastLoginAt" TIMESTAMPTZ(3),
    "createdAt" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMPTZ(3) NOT NULL,
    "deactivatedAt" TIMESTAMPTZ(3),

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "RefreshSession" (
    "id" UUID NOT NULL,
    "userId" UUID NOT NULL,
    "tokenHash" TEXT NOT NULL,
    "expiresAt" TIMESTAMPTZ(3) NOT NULL,
    "revokedAt" TIMESTAMPTZ(3),
    "replacedBySessionId" UUID,
    "userAgent" TEXT,
    "ipAddress" TEXT,
    "createdAt" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "RefreshSession_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MemberProfile" (
    "id" UUID NOT NULL,
    "gymId" UUID NOT NULL,
    "userId" UUID NOT NULL,
    "memberCode" TEXT NOT NULL,
    "firstName" TEXT NOT NULL,
    "lastName" TEXT NOT NULL,
    "birthDate" DATE,
    "phone" TEXT,
    "status" "ProfileStatus" NOT NULL DEFAULT 'ACTIVE',
    "joinedAt" DATE NOT NULL,
    "createdAt" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMPTZ(3) NOT NULL,
    "deactivatedAt" TIMESTAMPTZ(3),

    CONSTRAINT "MemberProfile_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TrainerProfile" (
    "id" UUID NOT NULL,
    "gymId" UUID NOT NULL,
    "userId" UUID NOT NULL,
    "trainerCode" TEXT NOT NULL,
    "firstName" TEXT NOT NULL,
    "lastName" TEXT NOT NULL,
    "phone" TEXT,
    "specialty" TEXT,
    "status" "ProfileStatus" NOT NULL DEFAULT 'ACTIVE',
    "createdAt" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMPTZ(3) NOT NULL,

    CONSTRAINT "TrainerProfile_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TrainerMemberAssignment" (
    "id" UUID NOT NULL,
    "gymId" UUID NOT NULL,
    "trainerId" UUID NOT NULL,
    "memberId" UUID NOT NULL,
    "status" "AssignmentStatus" NOT NULL DEFAULT 'ACTIVE',
    "assignedAt" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "endedAt" TIMESTAMPTZ(3),
    "assignedById" UUID NOT NULL,

    CONSTRAINT "TrainerMemberAssignment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MembershipPlan" (
    "id" UUID NOT NULL,
    "gymId" UUID NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "durationValue" INTEGER NOT NULL,
    "durationUnit" "DurationUnit" NOT NULL,
    "price" DECIMAL(10,2) NOT NULL,
    "currency" VARCHAR(3) NOT NULL DEFAULT 'USD',
    "status" "MembershipPlanStatus" NOT NULL DEFAULT 'ACTIVE',
    "createdAt" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMPTZ(3) NOT NULL,

    CONSTRAINT "MembershipPlan_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Membership" (
    "id" UUID NOT NULL,
    "gymId" UUID NOT NULL,
    "memberId" UUID NOT NULL,
    "planId" UUID NOT NULL,
    "planNameSnapshot" TEXT NOT NULL,
    "priceSnapshot" DECIMAL(10,2) NOT NULL,
    "currencySnapshot" VARCHAR(3) NOT NULL,
    "startsOn" DATE NOT NULL,
    "endsOn" DATE NOT NULL,
    "status" "MembershipStatus" NOT NULL,
    "assignedById" UUID NOT NULL,
    "cancelledAt" TIMESTAMPTZ(3),
    "cancelledById" UUID,
    "cancellationReason" TEXT,
    "createdAt" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMPTZ(3) NOT NULL,

    CONSTRAINT "Membership_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Attendance" (
    "id" UUID NOT NULL,
    "gymId" UUID NOT NULL,
    "memberId" UUID NOT NULL,
    "membershipId" UUID,
    "checkedInAt" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "source" "AttendanceSource" NOT NULL,
    "recordedById" UUID NOT NULL,
    "notes" TEXT,
    "createdAt" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Attendance_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Exercise" (
    "id" UUID NOT NULL,
    "source" TEXT NOT NULL,
    "externalId" TEXT,
    "canonicalName" TEXT NOT NULL,
    "bodyPart" TEXT NOT NULL,
    "targetMuscle" TEXT NOT NULL,
    "muscleGroup" TEXT,
    "secondaryMuscles" TEXT[],
    "equipment" TEXT NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "isCustom" BOOLEAN NOT NULL DEFAULT false,
    "sourceAttribution" TEXT,
    "sourceHash" TEXT,
    "importedAt" TIMESTAMPTZ(3),
    "createdAt" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMPTZ(3) NOT NULL,

    CONSTRAINT "Exercise_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ExerciseTranslation" (
    "id" UUID NOT NULL,
    "exerciseId" UUID NOT NULL,
    "locale" VARCHAR(10) NOT NULL,
    "name" TEXT,
    "instructions" TEXT NOT NULL,
    "steps" TEXT[],
    "createdAt" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMPTZ(3) NOT NULL,

    CONSTRAINT "ExerciseTranslation_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Routine" (
    "id" UUID NOT NULL,
    "gymId" UUID NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "goal" TEXT,
    "status" "RoutineStatus" NOT NULL DEFAULT 'DRAFT',
    "createdByTrainerId" UUID,
    "createdByUserId" UUID NOT NULL,
    "createdAt" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMPTZ(3) NOT NULL,

    CONSTRAINT "Routine_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "RoutineVersion" (
    "id" UUID NOT NULL,
    "routineId" UUID NOT NULL,
    "versionNumber" INTEGER NOT NULL,
    "nameSnapshot" TEXT NOT NULL,
    "descriptionSnapshot" TEXT,
    "goalSnapshot" TEXT,
    "status" "RoutineVersionStatus" NOT NULL DEFAULT 'DRAFT',
    "publishedAt" TIMESTAMPTZ(3),
    "publishedById" UUID,
    "createdAt" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "RoutineVersion_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "RoutineVersionExercise" (
    "id" UUID NOT NULL,
    "routineVersionId" UUID NOT NULL,
    "exerciseId" UUID NOT NULL,
    "dayNumber" INTEGER NOT NULL,
    "position" INTEGER NOT NULL,
    "sets" INTEGER,
    "prescriptionType" "PrescriptionType" NOT NULL,
    "repetitionsMin" INTEGER,
    "repetitionsMax" INTEGER,
    "durationSeconds" INTEGER,
    "targetWeight" DECIMAL(8,2),
    "weightUnit" "WeightUnit",
    "restSeconds" INTEGER,
    "notes" TEXT,

    CONSTRAINT "RoutineVersionExercise_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "RoutineAssignment" (
    "id" UUID NOT NULL,
    "gymId" UUID NOT NULL,
    "memberId" UUID NOT NULL,
    "routineVersionId" UUID NOT NULL,
    "assignedById" UUID NOT NULL,
    "startsOn" DATE NOT NULL,
    "endsOn" DATE,
    "status" "RoutineAssignmentStatus" NOT NULL,
    "createdAt" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMPTZ(3) NOT NULL,

    CONSTRAINT "RoutineAssignment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AuditLog" (
    "id" UUID NOT NULL,
    "gymId" UUID NOT NULL,
    "actorUserId" UUID,
    "action" TEXT NOT NULL,
    "resourceType" TEXT NOT NULL,
    "resourceId" UUID,
    "metadata" JSONB,
    "createdAt" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "AuditLog_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Gym_slug_key" ON "Gym"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE INDEX "User_gymId_role_idx" ON "User"("gymId", "role");

-- CreateIndex
CREATE INDEX "User_gymId_status_idx" ON "User"("gymId", "status");

-- CreateIndex
CREATE UNIQUE INDEX "RefreshSession_tokenHash_key" ON "RefreshSession"("tokenHash");

-- CreateIndex
CREATE UNIQUE INDEX "RefreshSession_replacedBySessionId_key" ON "RefreshSession"("replacedBySessionId");

-- CreateIndex
CREATE INDEX "RefreshSession_userId_idx" ON "RefreshSession"("userId");

-- CreateIndex
CREATE INDEX "RefreshSession_expiresAt_idx" ON "RefreshSession"("expiresAt");

-- CreateIndex
CREATE UNIQUE INDEX "MemberProfile_userId_key" ON "MemberProfile"("userId");

-- CreateIndex
CREATE INDEX "MemberProfile_gymId_status_idx" ON "MemberProfile"("gymId", "status");

-- CreateIndex
CREATE INDEX "MemberProfile_gymId_lastName_firstName_idx" ON "MemberProfile"("gymId", "lastName", "firstName");

-- CreateIndex
CREATE UNIQUE INDEX "MemberProfile_gymId_memberCode_key" ON "MemberProfile"("gymId", "memberCode");

-- CreateIndex
CREATE UNIQUE INDEX "TrainerProfile_userId_key" ON "TrainerProfile"("userId");

-- CreateIndex
CREATE INDEX "TrainerProfile_gymId_status_idx" ON "TrainerProfile"("gymId", "status");

-- CreateIndex
CREATE INDEX "TrainerProfile_gymId_lastName_firstName_idx" ON "TrainerProfile"("gymId", "lastName", "firstName");

-- CreateIndex
CREATE UNIQUE INDEX "TrainerProfile_gymId_trainerCode_key" ON "TrainerProfile"("gymId", "trainerCode");

-- CreateIndex
CREATE INDEX "TrainerMemberAssignment_trainerId_status_idx" ON "TrainerMemberAssignment"("trainerId", "status");

-- CreateIndex
CREATE INDEX "TrainerMemberAssignment_memberId_status_idx" ON "TrainerMemberAssignment"("memberId", "status");

-- CreateIndex
CREATE INDEX "TrainerMemberAssignment_gymId_status_idx" ON "TrainerMemberAssignment"("gymId", "status");

-- CreateIndex
CREATE INDEX "MembershipPlan_gymId_status_idx" ON "MembershipPlan"("gymId", "status");

-- CreateIndex
CREATE INDEX "MembershipPlan_gymId_name_idx" ON "MembershipPlan"("gymId", "name");

-- CreateIndex
CREATE INDEX "Membership_memberId_status_idx" ON "Membership"("memberId", "status");

-- CreateIndex
CREATE INDEX "Membership_memberId_startsOn_endsOn_idx" ON "Membership"("memberId", "startsOn", "endsOn");

-- CreateIndex
CREATE INDEX "Membership_gymId_status_idx" ON "Membership"("gymId", "status");

-- CreateIndex
CREATE INDEX "Membership_gymId_endsOn_idx" ON "Membership"("gymId", "endsOn");

-- CreateIndex
CREATE INDEX "Attendance_memberId_checkedInAt_idx" ON "Attendance"("memberId", "checkedInAt");

-- CreateIndex
CREATE INDEX "Attendance_gymId_checkedInAt_idx" ON "Attendance"("gymId", "checkedInAt");

-- CreateIndex
CREATE INDEX "Attendance_membershipId_idx" ON "Attendance"("membershipId");

-- CreateIndex
CREATE INDEX "Exercise_isActive_idx" ON "Exercise"("isActive");

-- CreateIndex
CREATE INDEX "Exercise_bodyPart_idx" ON "Exercise"("bodyPart");

-- CreateIndex
CREATE INDEX "Exercise_targetMuscle_idx" ON "Exercise"("targetMuscle");

-- CreateIndex
CREATE INDEX "Exercise_equipment_idx" ON "Exercise"("equipment");

-- CreateIndex
CREATE INDEX "Exercise_canonicalName_idx" ON "Exercise"("canonicalName");

-- CreateIndex
CREATE UNIQUE INDEX "Exercise_source_externalId_key" ON "Exercise"("source", "externalId");

-- CreateIndex
CREATE UNIQUE INDEX "ExerciseTranslation_exerciseId_locale_key" ON "ExerciseTranslation"("exerciseId", "locale");

-- CreateIndex
CREATE INDEX "Routine_gymId_status_idx" ON "Routine"("gymId", "status");

-- CreateIndex
CREATE INDEX "Routine_createdByTrainerId_status_idx" ON "Routine"("createdByTrainerId", "status");

-- CreateIndex
CREATE UNIQUE INDEX "RoutineVersion_routineId_versionNumber_key" ON "RoutineVersion"("routineId", "versionNumber");

-- CreateIndex
CREATE INDEX "RoutineVersionExercise_routineVersionId_idx" ON "RoutineVersionExercise"("routineVersionId");

-- CreateIndex
CREATE INDEX "RoutineVersionExercise_exerciseId_idx" ON "RoutineVersionExercise"("exerciseId");

-- CreateIndex
CREATE UNIQUE INDEX "RoutineVersionExercise_routineVersionId_dayNumber_position_key" ON "RoutineVersionExercise"("routineVersionId", "dayNumber", "position");

-- CreateIndex
CREATE INDEX "RoutineAssignment_memberId_status_idx" ON "RoutineAssignment"("memberId", "status");

-- CreateIndex
CREATE INDEX "RoutineAssignment_gymId_status_idx" ON "RoutineAssignment"("gymId", "status");

-- CreateIndex
CREATE INDEX "RoutineAssignment_routineVersionId_idx" ON "RoutineAssignment"("routineVersionId");

-- CreateIndex
CREATE INDEX "AuditLog_gymId_createdAt_idx" ON "AuditLog"("gymId", "createdAt");

-- CreateIndex
CREATE INDEX "AuditLog_actorUserId_createdAt_idx" ON "AuditLog"("actorUserId", "createdAt");

-- CreateIndex
CREATE INDEX "AuditLog_resourceType_resourceId_idx" ON "AuditLog"("resourceType", "resourceId");

-- AddForeignKey
ALTER TABLE "GymCodeSequence" ADD CONSTRAINT "GymCodeSequence_gymId_fkey" FOREIGN KEY ("gymId") REFERENCES "Gym"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_gymId_fkey" FOREIGN KEY ("gymId") REFERENCES "Gym"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RefreshSession" ADD CONSTRAINT "RefreshSession_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RefreshSession" ADD CONSTRAINT "RefreshSession_replacedBySessionId_fkey" FOREIGN KEY ("replacedBySessionId") REFERENCES "RefreshSession"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MemberProfile" ADD CONSTRAINT "MemberProfile_gymId_fkey" FOREIGN KEY ("gymId") REFERENCES "Gym"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MemberProfile" ADD CONSTRAINT "MemberProfile_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TrainerProfile" ADD CONSTRAINT "TrainerProfile_gymId_fkey" FOREIGN KEY ("gymId") REFERENCES "Gym"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TrainerProfile" ADD CONSTRAINT "TrainerProfile_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TrainerMemberAssignment" ADD CONSTRAINT "TrainerMemberAssignment_gymId_fkey" FOREIGN KEY ("gymId") REFERENCES "Gym"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TrainerMemberAssignment" ADD CONSTRAINT "TrainerMemberAssignment_trainerId_fkey" FOREIGN KEY ("trainerId") REFERENCES "TrainerProfile"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TrainerMemberAssignment" ADD CONSTRAINT "TrainerMemberAssignment_memberId_fkey" FOREIGN KEY ("memberId") REFERENCES "MemberProfile"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TrainerMemberAssignment" ADD CONSTRAINT "TrainerMemberAssignment_assignedById_fkey" FOREIGN KEY ("assignedById") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MembershipPlan" ADD CONSTRAINT "MembershipPlan_gymId_fkey" FOREIGN KEY ("gymId") REFERENCES "Gym"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Membership" ADD CONSTRAINT "Membership_gymId_fkey" FOREIGN KEY ("gymId") REFERENCES "Gym"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Membership" ADD CONSTRAINT "Membership_memberId_fkey" FOREIGN KEY ("memberId") REFERENCES "MemberProfile"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Membership" ADD CONSTRAINT "Membership_planId_fkey" FOREIGN KEY ("planId") REFERENCES "MembershipPlan"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Membership" ADD CONSTRAINT "Membership_assignedById_fkey" FOREIGN KEY ("assignedById") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Membership" ADD CONSTRAINT "Membership_cancelledById_fkey" FOREIGN KEY ("cancelledById") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Attendance" ADD CONSTRAINT "Attendance_gymId_fkey" FOREIGN KEY ("gymId") REFERENCES "Gym"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Attendance" ADD CONSTRAINT "Attendance_memberId_fkey" FOREIGN KEY ("memberId") REFERENCES "MemberProfile"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Attendance" ADD CONSTRAINT "Attendance_membershipId_fkey" FOREIGN KEY ("membershipId") REFERENCES "Membership"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Attendance" ADD CONSTRAINT "Attendance_recordedById_fkey" FOREIGN KEY ("recordedById") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ExerciseTranslation" ADD CONSTRAINT "ExerciseTranslation_exerciseId_fkey" FOREIGN KEY ("exerciseId") REFERENCES "Exercise"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Routine" ADD CONSTRAINT "Routine_gymId_fkey" FOREIGN KEY ("gymId") REFERENCES "Gym"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Routine" ADD CONSTRAINT "Routine_createdByTrainerId_fkey" FOREIGN KEY ("createdByTrainerId") REFERENCES "TrainerProfile"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Routine" ADD CONSTRAINT "Routine_createdByUserId_fkey" FOREIGN KEY ("createdByUserId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RoutineVersion" ADD CONSTRAINT "RoutineVersion_routineId_fkey" FOREIGN KEY ("routineId") REFERENCES "Routine"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RoutineVersion" ADD CONSTRAINT "RoutineVersion_publishedById_fkey" FOREIGN KEY ("publishedById") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RoutineVersionExercise" ADD CONSTRAINT "RoutineVersionExercise_routineVersionId_fkey" FOREIGN KEY ("routineVersionId") REFERENCES "RoutineVersion"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RoutineVersionExercise" ADD CONSTRAINT "RoutineVersionExercise_exerciseId_fkey" FOREIGN KEY ("exerciseId") REFERENCES "Exercise"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RoutineAssignment" ADD CONSTRAINT "RoutineAssignment_gymId_fkey" FOREIGN KEY ("gymId") REFERENCES "Gym"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RoutineAssignment" ADD CONSTRAINT "RoutineAssignment_memberId_fkey" FOREIGN KEY ("memberId") REFERENCES "MemberProfile"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RoutineAssignment" ADD CONSTRAINT "RoutineAssignment_routineVersionId_fkey" FOREIGN KEY ("routineVersionId") REFERENCES "RoutineVersion"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RoutineAssignment" ADD CONSTRAINT "RoutineAssignment_assignedById_fkey" FOREIGN KEY ("assignedById") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AuditLog" ADD CONSTRAINT "AuditLog_gymId_fkey" FOREIGN KEY ("gymId") REFERENCES "Gym"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AuditLog" ADD CONSTRAINT "AuditLog_actorUserId_fkey" FOREIGN KEY ("actorUserId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- Domain integrity constraints not expressible in the Prisma schema.
ALTER TABLE "GymCodeSequence"
ADD CONSTRAINT "GymCodeSequence_positive_numbers_check"
CHECK ("nextMemberNumber" > 0 AND "nextTrainerNumber" > 0);

ALTER TABLE "Gym"
ADD CONSTRAINT "Gym_currency_format_check"
CHECK ("currency" ~ '^[A-Z]{3}$');

ALTER TABLE "User"
ADD CONSTRAINT "User_normalized_email_check"
CHECK ("email" = lower("email"));

ALTER TABLE "MemberProfile"
ADD CONSTRAINT "MemberProfile_code_format_check"
CHECK ("memberCode" ~ '^MEM-[0-9]{6,}$');

ALTER TABLE "TrainerProfile"
ADD CONSTRAINT "TrainerProfile_code_format_check"
CHECK ("trainerCode" ~ '^TRN-[0-9]{6,}$');

ALTER TABLE "TrainerMemberAssignment"
ADD CONSTRAINT "TrainerMemberAssignment_dates_check"
CHECK ("endedAt" IS NULL OR "endedAt" >= "assignedAt");

CREATE UNIQUE INDEX "TrainerMemberAssignment_active_unique"
ON "TrainerMemberAssignment"("trainerId", "memberId")
WHERE "status" = 'ACTIVE';

ALTER TABLE "MembershipPlan"
ADD CONSTRAINT "MembershipPlan_values_check"
CHECK (
  "durationValue" > 0
  AND "price" >= 0
  AND "currency" ~ '^[A-Z]{3}$'
);

ALTER TABLE "Membership"
ADD CONSTRAINT "Membership_values_check"
CHECK (
  "endsOn" >= "startsOn"
  AND "priceSnapshot" >= 0
  AND "currencySnapshot" ~ '^[A-Z]{3}$'
);

ALTER TABLE "Membership"
ADD CONSTRAINT "Membership_cancellation_check"
CHECK (
  (
    "status" = 'CANCELLED'
    AND "cancelledAt" IS NOT NULL
    AND "cancelledById" IS NOT NULL
  )
  OR (
    "status" <> 'CANCELLED'
    AND "cancelledAt" IS NULL
    AND "cancelledById" IS NULL
    AND "cancellationReason" IS NULL
  )
);

CREATE EXTENSION IF NOT EXISTS btree_gist;

ALTER TABLE "Membership"
ADD CONSTRAINT "Membership_no_active_overlap"
EXCLUDE USING gist (
  "memberId" WITH =,
  daterange("startsOn", "endsOn", '[]') WITH &&
)
WHERE ("status" IN ('PENDING', 'ACTIVE'));

ALTER TABLE "Exercise"
ADD CONSTRAINT "Exercise_source_identity_check"
CHECK ("isCustom" OR "externalId" IS NOT NULL);

ALTER TABLE "RoutineVersion"
ADD CONSTRAINT "RoutineVersion_publication_check"
CHECK (
  "versionNumber" > 0
  AND (
    (
      "status" = 'PUBLISHED'
      AND "publishedAt" IS NOT NULL
      AND "publishedById" IS NOT NULL
    )
    OR (
      "status" = 'DRAFT'
      AND "publishedAt" IS NULL
      AND "publishedById" IS NULL
    )
  )
);

ALTER TABLE "RoutineVersionExercise"
ADD CONSTRAINT "RoutineVersionExercise_values_check"
CHECK (
  "dayNumber" > 0
  AND "position" > 0
  AND ("sets" IS NULL OR "sets" > 0)
  AND ("restSeconds" IS NULL OR "restSeconds" >= 0)
  AND (
    ("targetWeight" IS NULL AND "weightUnit" IS NULL)
    OR ("targetWeight" >= 0 AND "weightUnit" IS NOT NULL)
  )
);

ALTER TABLE "RoutineVersionExercise"
ADD CONSTRAINT "RoutineVersionExercise_prescription_check"
CHECK (
  (
    "prescriptionType" = 'REPETITIONS'
    AND "repetitionsMin" > 0
    AND (
      "repetitionsMax" IS NULL
      OR "repetitionsMax" >= "repetitionsMin"
    )
    AND "durationSeconds" IS NULL
  )
  OR (
    "prescriptionType" = 'DURATION'
    AND "durationSeconds" > 0
    AND "repetitionsMin" IS NULL
    AND "repetitionsMax" IS NULL
  )
);

ALTER TABLE "RoutineAssignment"
ADD CONSTRAINT "RoutineAssignment_dates_check"
CHECK ("endsOn" IS NULL OR "endsOn" >= "startsOn");
