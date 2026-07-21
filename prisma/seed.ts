import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("Seeding database...");

  // 1. Create a default user
  const adminEmail = "admin@socialgraph.local";
  const existingUser = await prisma.user.findUnique({
    where: { email: adminEmail },
  });

  if (!existingUser) {
    await prisma.user.create({
      data: {
        email: adminEmail,
        password: "adminpassword123", // Plain text or hash for basic auth demo
        name: "Administrator",
      },
    });
    console.log("Admin user created.");
  }

  // 2. Create a complete, rich analysis job for Linus Torvalds (GitHub profile)
  const torvaldsJob = await prisma.analysisJob.create({
    data: {
      inputUrl: "https://github.com/torvalds",
      normalizedUrl: "https://github.com/torvalds",
      detectedPlatform: "github",
      status: "COMPLETED",
      completedAt: new Date(),
      profiles: {
        create: {
          platform: "github",
          handle: "torvalds",
          displayName: "Linus Torvalds",
          avatarUrl: "https://avatars.githubusercontent.com/u/1024?v=4",
          bio: "The creator of Linux and Git.",
          website: "http://www.linuxfoundation.org",
          followersCount: 210000,
          followingCount: 0,
          postsCount: 28, // Repositories
          locationText: "Portland, OR",
          sourceUrl: "https://github.com/torvalds",
        },
      },
      entities: {
        createMany: {
          data: [
            {
              id: "entity-torvalds",
              entityType: "account",
              name: "torvalds (GitHub)",
              platform: "github",
              externalUrl: "https://github.com/torvalds",
              confidence: 0.98,
            },
            {
              id: "entity-linux-foundation",
              entityType: "company",
              name: "Linux Foundation",
              platform: "github",
              externalUrl: "https://www.linuxfoundation.org",
              confidence: 0.95,
            },
            {
              id: "entity-git-repo",
              entityType: "event", // Project/Codebase
              name: "Git Repository",
              platform: "github",
              externalUrl: "https://github.com/git/git",
              confidence: 0.95,
            },
            {
              id: "entity-greghh",
              entityType: "account",
              name: "gregkh (Greg Kroah-Hartman)",
              platform: "github",
              externalUrl: "https://github.com/gregkh",
              confidence: 0.90,
            },
            {
              id: "entity-portland",
              entityType: "place",
              name: "Portland, OR",
              confidence: 0.95,
            },
            {
              id: "entity-helsinki",
              entityType: "place",
              name: "Helsinki, Finland",
              confidence: 0.85,
            },
          ],
        },
      },
    },
  });

  // Create Locations
  await prisma.location.createMany({
    data: [
      {
        jobId: torvaldsJob.id,
        entityId: "entity-torvalds", // Linked to Linus himself
        label: "Portland, OR (Declared Home)",
        city: "Portland",
        state: "Oregon",
        country: "United States",
        lat: 45.5152,
        lng: -122.6784,
        locationType: "declared",
        confidence: 0.95,
        sourceUrl: "https://github.com/torvalds",
        evidenceText: "Declared profile location: 'Portland, OR'",
      },
      {
        jobId: torvaldsJob.id,
        entityId: "entity-linux-foundation", // Linked to Linux Foundation entity
        label: "San Francisco, CA (Linux Foundation HQ)",
        city: "San Francisco",
        state: "California",
        country: "United States",
        lat: 37.7749,
        lng: -122.4194,
        locationType: "organization",
        confidence: 0.90,
        sourceUrl: "https://www.linuxfoundation.org",
        evidenceText: "Linux Foundation headquarters listed as San Francisco, CA.",
      },
      {
        jobId: torvaldsJob.id,
        entityId: "entity-torvalds", // Linked to Linus himself
        label: "Helsinki, Finland (Birthplace & Education)",
        city: "Helsinki",
        state: "Uusimaa",
        country: "Finland",
        lat: 60.1699,
        lng: 24.9384,
        locationType: "inferred",
        confidence: 0.85,
        sourceUrl: "https://github.com/torvalds",
        evidenceText: "Inferred from University of Helsinki association and creator of Linux.",
      },
      {
        jobId: torvaldsJob.id,
        entityId: "entity-greghh", // Linked to gregkh
        label: "Berlin, Germany (Collaborator location)",
        city: "Berlin",
        state: "Berlin",
        country: "Germany",
        lat: 52.52,
        lng: 13.405,
        locationType: "inferred",
        confidence: 0.90,
        sourceUrl: "https://github.com/gregkh",
        evidenceText: "Collaborator Greg Kroah-Hartman base of operations.",
      },
    ],
  });

  // Create Edges (Relationships)
  await prisma.edge.createMany({
    data: [
      {
        jobId: torvaldsJob.id,
        sourceEntityId: "entity-torvalds",
        targetEntityId: "entity-linux-foundation",
        relationType: "same_org",
        weight: 1.0,
        confidence: 0.95,
        sourceUrl: "https://github.com/torvalds",
        evidenceText: "Profile lists association with Linux Foundation.",
      },
      {
        jobId: torvaldsJob.id,
        sourceEntityId: "entity-torvalds",
        targetEntityId: "entity-greghh",
        relationType: "collaborated",
        weight: 0.9,
        confidence: 0.92,
        sourceUrl: "https://github.com/torvalds",
        evidenceText: "Frequent co-commits and kernel maintenance collaboration on Linux repository.",
      },
      {
        jobId: torvaldsJob.id,
        sourceEntityId: "entity-torvalds",
        targetEntityId: "entity-git-repo",
        relationType: "linked_profile",
        weight: 0.95,
        confidence: 0.98,
        sourceUrl: "https://github.com/torvalds",
        evidenceText: "Creator of Git source control management system.",
      },
    ],
  });

  // Create Evidence Items for Linus
  await prisma.evidenceItem.createMany({
    data: [
      {
        jobId: torvaldsJob.id,
        entityId: "entity-torvalds",
        evidenceType: "API",
        sourceUrl: "https://api.github.com/users/torvalds",
        snippet: '{"login":"torvalds","name":"Linus Torvalds","location":"Portland, OR","company":"Linux Foundation"}',
        extractionMethod: "GitHub REST API Profile Fetch",
        confidence: 0.98,
      },
      {
        jobId: torvaldsJob.id,
        evidenceType: "text_nlp",
        sourceUrl: "https://github.com/torvalds",
        snippet: "The creator of Linux and Git.",
        extractionMethod: "Bio Text Entity Extraction",
        confidence: 0.95,
      },
    ],
  });

  // 3. Create a complete, rich analysis job for a Travel Influencer (Instagram profile)
  const wanderlustJob = await prisma.analysisJob.create({
    data: {
      inputUrl: "https://instagram.com/wanderlust_explorer",
      normalizedUrl: "https://instagram.com/wanderlust_explorer",
      detectedPlatform: "instagram",
      status: "COMPLETED",
      completedAt: new Date(),
      profiles: {
        create: {
          platform: "instagram",
          handle: "wanderlust_explorer",
          displayName: "Elena Vance | Travel & Outdoors",
          avatarUrl: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150",
          bio: "Photographer & Mountaineer. Chasing peaks globally. Business: contact@elenavance.travel 🏔️✈️",
          website: "https://elenavance.travel",
          followersCount: 154000,
          followingCount: 840,
          postsCount: 342,
          locationText: "Chamonix, France",
          sourceUrl: "https://instagram.com/wanderlust_explorer",
        },
      },
      entities: {
        createMany: {
          data: [
            {
              id: "entity-elena",
              entityType: "account",
              name: "wanderlust_explorer (Instagram)",
              platform: "instagram",
              externalUrl: "https://instagram.com/wanderlust_explorer",
              confidence: 0.99,
            },
            {
              id: "entity-chamonix",
              entityType: "place",
              name: "Chamonix, France",
              confidence: 0.95,
            },
            {
              id: "entity-reykjavik",
              entityType: "place",
              name: "Reykjavik, Iceland",
              confidence: 0.90,
            },
            {
              id: "entity-patagonia",
              entityType: "place",
              name: "Torres del Paine, Chile",
              confidence: 0.85,
            },
            {
              id: "entity-collab-alex",
              entityType: "account",
              name: "alex_adventures",
              platform: "instagram",
              externalUrl: "https://instagram.com/alex_adventures",
              confidence: 0.80,
            },
          ],
        },
      },
    },
  });

  // Create locations
  await prisma.location.createMany({
    data: [
      {
        jobId: wanderlustJob.id,
        entityId: "entity-elena", // Linked to Elena herself
        label: "Chamonix-Mont-Blanc, France",
        city: "Chamonix",
        state: "Auvergne-Rhône-Alpes",
        country: "France",
        lat: 45.9227,
        lng: 6.8685,
        locationType: "declared",
        confidence: 0.95,
        sourceUrl: "https://instagram.com/wanderlust_explorer",
        evidenceText: "Profile Bio Declared base: 'Chamonix, France'",
      },
      {
        jobId: wanderlustJob.id,
        entityId: "entity-elena", // Linked to Elena herself
        label: "Reykjavík, Iceland (Geotagged Post)",
        city: "Reykjavík",
        country: "Iceland",
        lat: 64.1466,
        lng: -21.9426,
        locationType: "geotag",
        confidence: 0.90,
        sourceUrl: "https://instagram.com/p/C-iceland-trip",
        evidenceText: "Post Geotag: 'Reykjavik, Iceland' on August 2025",
      },
      {
        jobId: wanderlustJob.id,
        entityId: "entity-elena", // Linked to Elena herself
        label: "Torres del Paine National Park, Chile (Caption Mention)",
        city: "Torres del Paine",
        state: "Magallanes",
        country: "Chile",
        lat: -51.2584,
        lng: -72.8847,
        locationType: "event",
        confidence: 0.85,
        sourceUrl: "https://instagram.com/p/C-patagonia",
        evidenceText: "Post caption: 'Epic trek through Torres del Paine Patagonia!'",
      },
      {
        jobId: wanderlustJob.id,
        entityId: "entity-collab-alex", // Linked to collaborator alex_adventures
        label: "Denver, CO (Collaborator location)",
        city: "Denver",
        state: "Colorado",
        country: "United States",
        lat: 39.7392,
        lng: -104.9903,
        locationType: "inferred",
        confidence: 0.85,
        sourceUrl: "https://instagram.com/alex_adventures",
        evidenceText: "Collaborator Alex Adventures base of operations in Denver.",
      },
    ],
  });

  // Create edges
  await prisma.edge.createMany({
    data: [
      {
        jobId: wanderlustJob.id,
        sourceEntityId: "entity-elena",
        targetEntityId: "entity-collab-alex",
        relationType: "collaborated",
        weight: 0.8,
        confidence: 0.85,
        sourceUrl: "https://instagram.com/p/C-collab",
        evidenceText: "Collaborative post tagged with @alex_adventures: 'Climbing together!'",
      },
    ],
  });

  console.log("Database seeded successfully.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
