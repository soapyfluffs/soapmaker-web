import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const db = {
  // Materials
  async getMaterials() {
    return await prisma.material.findMany();
  },

  async createMaterial(data) {
    return await prisma.material.create({
      data: {
        ...data,
        alternativeUnits: JSON.stringify(data.alternativeUnits),
        conversionRates: JSON.stringify(data.conversionRates),
      },
    });
  },

  async updateMaterial(id, data) {
    return await prisma.material.update({
      where: { id },
      data: {
        ...data,
        alternativeUnits: JSON.stringify(data.alternativeUnits),
        conversionRates: JSON.stringify(data.conversionRates),
      },
    });
  },

  async deleteMaterial(id) {
    return await prisma.material.delete({
      where: { id },
    });
  },

  // Recipes
  async getRecipes() {
    return await prisma.recipe.findMany({
      include: {
        oils: {
          include: {
            material: true,
          },
        },
      },
    });
  },

  async createRecipe(data) {
    const { oils, ...recipeData } = data;
    return await prisma.recipe.create({
      data: {
        ...recipeData,
        oils: {
          create: oils.map(oil => ({
            material: { connect: { id: oil.materialId } },
            weight: oil.weight,
          })),
        },
      },
      include: {
        oils: {
          include: {
            material: true,
          },
        },
      },
    });
  },

  async updateRecipe(id, data) {
    const { oils, ...recipeData } = data;
    
    // Delete existing oils
    await prisma.recipeOil.deleteMany({
      where: { recipeId: id },
    });

    return await prisma.recipe.update({
      where: { id },
      data: {
        ...recipeData,
        oils: {
          create: oils.map(oil => ({
            material: { connect: { id: oil.materialId } },
            weight: oil.weight,
          })),
        },
      },
      include: {
        oils: {
          include: {
            material: true,
          },
        },
      },
    });
  },

  async deleteRecipe(id) {
    return await prisma.recipe.delete({
      where: { id },
    });
  },

  // Products
  async getProducts() {
    return await prisma.product.findMany({
      include: {
        recipe: true,
      },
    });
  },

  async createProduct(data) {
    return await prisma.product.create({
      data,
      include: {
        recipe: true,
      },
    });
  },

  async updateProduct(id, data) {
    return await prisma.product.update({
      where: { id },
      data,
      include: {
        recipe: true,
      },
    });
  },

  async deleteProduct(id) {
    return await prisma.product.delete({
      where: { id },
    });
  },

  // Batches
  async getBatches() {
    return await prisma.batch.findMany({
      include: {
        recipe: true,
        qualityChecks: true,
        documents: true,
      },
    });
  },

  async createBatch(data) {
    const { qualityChecks, documents, ...batchData } = data;
    return await prisma.batch.create({
      data: {
        ...batchData,
        qualityChecks: {
          create: qualityChecks,
        },
        documents: {
          create: documents,
        },
      },
      include: {
        recipe: true,
        qualityChecks: true,
        documents: true,
      },
    });
  },

  async updateBatch(id, data) {
    const { qualityChecks, documents, ...batchData } = data;

    // Delete existing quality checks and documents
    await prisma.qualityCheck.deleteMany({
      where: { batchId: id },
    });
    await prisma.document.deleteMany({
      where: { batchId: id },
    });

    return await prisma.batch.update({
      where: { id },
      data: {
        ...batchData,
        qualityChecks: {
          create: qualityChecks,
        },
        documents: {
          create: documents,
        },
      },
      include: {
        recipe: true,
        qualityChecks: true,
        documents: true,
      },
    });
  },

  async deleteBatch(id) {
    return await prisma.batch.delete({
      where: { id },
    });
  },

  // Settings
  async getSettings() {
    const settings = await prisma.settings.findFirst();
    return settings || await prisma.settings.create({
      data: {},
    });
  },

  async updateSettings(data) {
    const settings = await prisma.settings.findFirst();
    if (settings) {
      return await prisma.settings.update({
        where: { id: settings.id },
        data,
      });
    }
    return await prisma.settings.create({
      data,
    });
  },
};