import {
  registrationsTable,
  eventsTable,
  usersTable,
} from "../db/schema/index.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import db from "../db/index.js";
import { eq, and } from "drizzle-orm";

const createUser = asyncHandler(async (req, res) => {
  const { email, name } = req.body;

  if (!email || !name) {
    throw new ApiError(400, "All field are required!");
  }

  try {
    const [newUser] = await db
      .insert(usersTable)
      .values({
        email: email,
        name: name,
      })
      .returning({ id: usersTable.id });

    if (!newUser || !newUser.id) {
      throw new ApiError(500, "Something went wrong while creating the user.");
    }

    return res
      .status(201)
      .json(
        new ApiResponse(
          201,
          { Userid: newUser.id },
          "User created successfully."
        )
      );
  } catch (error) {
    throw new ApiError(
      500,
      `Failed to create User due to a database error: ${
        error.message || "Unknown database error"
      }`
    );
  }
});

const cancelRegistration = asyncHandler(async (req, res) => {
  const { userId, eventId } = req.body;
  if (!userId || !eventId) {
    throw new ApiError(
      400,
      "Both userId and eventId are required for registration."
    );
  }

  const parsedUserId = parseInt(userId, 10);
  const parsedEventId = parseInt(eventId, 10);

  if (isNaN(parsedUserId) || parsedUserId <= 0) {
    throw new ApiError(400, "Invalid userId provided.");
  }
  if (isNaN(parsedEventId) || parsedEventId <= 0) {
    throw new ApiError(400, "Invalid eventId provided.");
  }

  try {
    const [event] = await db
      .select()
      .from(eventsTable)
      .where(eq(eventsTable.id, parsedEventId));

    if (!event) {
      throw new ApiError(404, "Event not found.");
    }

    const [user] = await db
      .select()
      .from(usersTable)
      .where(eq(usersTable.id, parsedUserId));

    if (!user) {
      throw new ApiError(404, "User not found.");
    }

    const eventDateTime = new Date(event.datetime);
    const now = new Date();

    if (eventDateTime < now) {
      throw new ApiError(403, "Cannot cancel for a past event.");
    }

    const [existingRegistration] = await db
      .select()
      .from(registrationsTable)
      .where(
        and(
          eq(registrationsTable.userId, parsedUserId),
          eq(registrationsTable.eventId, parsedEventId)
        )
      );

    if (!existingRegistration) {
      throw new ApiError(
        404,
        "Registration not found for this user and event. Cannot cancel."
      );
    }

    const deletedRows = await db
      .delete(registrationsTable)
      .where(
        and(
          eq(registrationsTable.userId, parsedUserId),
          eq(registrationsTable.eventId, parsedEventId)
        )
      );

    if (!deletedRows || deletedRows.length === 0) {
      throw new ApiError(
        500,
        "Failed to cancel registration due to an unexpected database issue."
      );
    }

    return res
      .status(200)
      .json(
        new ApiResponse(
          200,
          { userId: parsedUserId, eventId: parsedEventId },
          "Registration cancelled successfully."
        )
      );
  } catch (error) {
    throw new ApiError(
      500,
      `Failed to cancel registration for event due to a database error: ${
        error.message || "Unknown database error"
      }`
    );
  }
});

export { createUser, cancelRegistration };
