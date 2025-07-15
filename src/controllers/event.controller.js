import {
  eventsTable,
  usersTable,
  registrationsTable,
} from "../db/schema/index.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";

import db from "../db/index.js";
import { eq, and, count, gt, asc } from "drizzle-orm";

const createEvent = asyncHandler(async (req, res) => {
  const { capacity, title, datetime, location } = req.body;

  if (
    !title ||
    !datetime ||
    !location ||
    capacity === undefined ||
    capacity === null
  ) {
    throw new ApiError(
      400,
      "Title, Date & Time, Location, and Capacity are all required."
    );
  }

  const parsedCapacity = parseInt(capacity, 10);
  if (isNaN(parsedCapacity) || parsedCapacity <= 0 || parsedCapacity > 1000) {
    throw new ApiError(
      400,
      "Capacity must be a positive integer and not exceed 1000."
    );
  }

  if (isNaN(new Date(datetime).getTime())) {
    throw new ApiError(400, "Date & Time must be in a valid ISO format.");
  }

  try {
    const [newEvent] = await db
      .insert(eventsTable)
      .values({
        title: title,
        capacity: parsedCapacity,
        datetime: datetime,
        location: location,
      })
      .returning({ id: eventsTable.id });

    if (!newEvent || !newEvent.id) {
      throw new ApiError(500, "Something went wrong while creating the event.");
    }

    return res
      .status(201)
      .json(
        new ApiResponse(
          201,
          { eventId: newEvent.id },
          "Event created successfully."
        )
      );
  } catch (error) {
    throw new ApiError(
      500,
      `Failed to create event due to a database error: ${
        error.message || "Unknown database error"
      }`
    );
  }
});

const registerEvent = asyncHandler(async (req, res) => {
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

    // Check if the user exists
    const [userExists] = await db
      .select()
      .from(usersTable)
      .where(eq(usersTable.id, parsedUserId));

    if (!userExists) {
      throw new ApiError(404, "User not found.");
    }

    //  Cannot register for past events
    const eventDateTime = new Date(event.datetime);
    const now = new Date();

    if (eventDateTime < now) {
      throw new ApiError(403, "Cannot register for a past event.");
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

    if (existingRegistration) {
      throw new ApiError(409, "User is already registered for this event.");
    }

    const [registrationsCount] = await db
      .select({
        count: count(registrationsTable.userId),
      })
      .from(registrationsTable)
      .where(eq(registrationsTable.eventId, parsedEventId));

    if (registrationsCount.count >= event.capacity) {
      throw new ApiError(403, "Event capacity reached. Cannot register."); // 403 Forbidden
    }

    const [newRegistration] = await db
      .insert(registrationsTable)
      .values({
        userId: parsedUserId,
        eventId: parsedEventId,
      })
      .returning();

    if (!newRegistration) {
      throw new ApiError(
        500,
        "Something went wrong while registering for the event."
      );
    }

    return res
      .status(201)
      .json(new ApiResponse(201, "Registration successful."));
  } catch (error) {
    throw new ApiError(
      500,
      `Failed to register for event due to a database error: ${
        error.message || "Unknown database error"
      }`
    );
  }
});

const getEventDetails = asyncHandler(async (req, res) => {
  const { eventId } = req.query;

  if (!eventId) {
    throw new ApiError(400, "EventId is required");
  }

  const parsedEventId = parseInt(eventId, 10);

  if (isNaN(parsedEventId) || parsedEventId <= 0) {
    throw new ApiError(400, "Invalid eventId provided.");
  }

  try {
    const [event] = await db
      .select()
      .from(eventsTable)
      .where(eq(eventsTable.id, parsedEventId));

    if (!event) {
      throw new ApiError(404, "Event not found");
    }

    return res.status(201).json(
      new ApiResponse(
        201,
        {
          title: event.title,
          datetime: event.datetime,
          location: event.location,
        },
        " Event fetched successfully"
      )
    );
  } catch (error) {
    throw new ApiError(500, error.message);
  }
});

const listUpcomingEvents = asyncHandler(async (req, res) => {
  try {
    const now = new Date();
    const nowIsoString = now.toISOString();

    const upcomingEvents = await db
      .select()
      .from(eventsTable)
      .where(gt(eventsTable.datetime, nowIsoString))
      .orderBy(asc(eventsTable.datetime), asc(eventsTable.location));

    if (!upcomingEvents || upcomingEvents.length === 0) {
      return res
        .status(200)
        .json(new ApiResponse(200, [], "No upcoming events found."));
    }

    return res
      .status(200)
      .json(
        new ApiResponse(
          200,
          upcomingEvents,
          "Successfully fetched upcoming events."
        )
      );
  } catch (error) {
    throw new ApiError(
      500,
      `Failed to list upcoming events due to a database error: ${
        error.message || "Unknown database error"
      }`
    );
  }
});

const getEventStats = asyncHandler(async (req, res) => {
  const { eventId } = req.query;

  if (!eventId) {
    throw new ApiError(400, "Event ID is required to get event statistics.");
  }

  const parsedEventId = parseInt(eventId, 10);

  if (isNaN(parsedEventId) || parsedEventId <= 0) {
    throw new ApiError(400, "Invalid event ID provided.");
  }

  try {
    const [event] = await db
      .select()
      .from(eventsTable)
      .where(eq(eventsTable.id, parsedEventId));

    if (!event) {
      throw new ApiError(404, "Event not found.");
    }

    const [registrationsCountResult] = await db
      .select({
        totalRegistrations: count(registrationsTable.userId),
      })
      .from(registrationsTable)
      .where(eq(registrationsTable.eventId, parsedEventId));

    const totalRegistrations = registrationsCountResult.totalRegistrations;

    const eventCapacity = event.capacity;
    const remainingCapacity = Math.max(0, eventCapacity - totalRegistrations);

    let percentageCapacityUsed = 0;
    if (eventCapacity > 0) {
      percentageCapacityUsed = (totalRegistrations / eventCapacity) * 100;
    }

    percentageCapacityUsed = parseFloat(percentageCapacityUsed.toFixed(2));

    const stats = {
      eventId: event.id,
      eventTitle: event.title,
      totalRegistrations: totalRegistrations,
      remainingCapacity: remainingCapacity,
      percentageCapacityUsed: percentageCapacityUsed,
    };

    return res
      .status(200)
      .json(
        new ApiResponse(200, stats, "Event statistics fetched successfully.")
      );
  } catch (error) {
    throw new ApiError(
      500,
      `Failed to fetch event statistics due to a database error: ${
        error.message || "Unknown database error"
      }`
    );
  }
});

export {
  createEvent,
  registerEvent,
  getEventDetails,
  listUpcomingEvents,
  getEventStats,
};
