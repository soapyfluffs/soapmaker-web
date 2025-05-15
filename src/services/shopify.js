class ShopifyService {
  constructor(domain, accessToken) {
    this.domain = domain;
    this.accessToken = accessToken;
    this.baseUrl = `https://${domain}/admin/api/2023-04`;
  }

  async fetchApi(endpoint, options = {}) {
    const response = await fetch(`${this.baseUrl}${endpoint}`, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        'X-Shopify-Access-Token': this.accessToken,
        ...options.headers,
      },
    });

    if (!response.ok) {
      throw new Error(`Shopify API error: ${response.statusText}`);
    }

    return await response.json();
  }

  async getProducts() {
    return await this.fetchApi('/products.json');
  }

  async createProduct(product) {
    return await this.fetchApi('/products.json', {
      method: 'POST',
      body: JSON.stringify({ product }),
    });
  }

  async updateProduct(id, product) {
    return await this.fetchApi(`/products/${id}.json`, {
      method: 'PUT',
      body: JSON.stringify({ product }),
    });
  }

  async updateInventory(inventoryItemId, quantity) {
    return await this.fetchApi('/inventory_levels/set.json', {
      method: 'POST',
      body: JSON.stringify({
        inventory_item_id: inventoryItemId,
        available: quantity,
      }),
    });
  }

  async syncProduct(product) {
    if (product.shopifyId) {
      // Update existing Shopify product
      return await this.updateProduct(product.shopifyId, {
        title: product.name,
        body_html: product.description,
        variants: [{
          price: product.price,
          weight: product.weight,
          sku: product.sku,
        }],
      });
    } else {
      // Create new Shopify product
      const shopifyProduct = await this.createProduct({
        title: product.name,
        body_html: product.description,
        variants: [{
          price: product.price,
          weight: product.weight,
          sku: product.sku,
        }],
      });
      return shopifyProduct;
    }
  }
}

export default ShopifyService;