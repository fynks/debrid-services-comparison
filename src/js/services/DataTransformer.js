/**
 * Transforms indexed JSON data (services + supported indices) into flat format
 */
export class DataTransformer {
  static transformIndexedData(data) {
    if (!data?.services || !data?.supported) {
      return { isIndexed: false, data };
    }

    const { services, supported } = data;
    const transformed = {};

    Object.entries(supported).forEach(([host, indices]) => {
      transformed[host] = Object.fromEntries(
        services.map((service, idx) => [
          service,
          indices.includes(idx) ? '✅' : '❌'
        ])
      );
    });

    return {
      isIndexed: true,
      data: transformed,
      services
    };
  }

  static extractServices(data) {
    const firstHost = Object.values(data)[0];
    return firstHost ? Object.keys(firstHost) : [];
  }
}
