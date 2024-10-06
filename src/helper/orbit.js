// Constants
const mu = 398600.4418; // Earth's gravitational parameter (km^3/s^2)
const earth_radius = 6378.137; // Earth's radius (km)
const e = 0.0001302; // Orbital eccentricity of Landsat 8
const i = (Math.PI / 180) * 98.2; // Orbital inclination (radians)
const a = 7050; // Semi-major axis of Landsat 8 orbit (km)
const T = 99 * 60; // Orbital period (99 minutes) in seconds
const M0 = (Math.PI / 180) * 265.6032; // Mean anomaly at epoch (radians)
const arg_perigee = (Math.PI / 180) * 94.5315; // Argument of perigee (radians)
let raan0 = (Math.PI / 180) * 340.781; // Initial RAAN (radians)
const raan_rate = (2 * Math.PI) / (24 * 3600); // RAAN regression rate (rad/s)

// Orbital mean motion (rad/s)
const n = (2 * Math.PI) / T;

// Function to calculate Mean Anomaly
function meanAnomaly(M0, n, t, t0) {
  const delta_t = (t - t0) / 1000; // Time difference in seconds
  const M = M0 + n * delta_t;
  return M % (2 * Math.PI); // Ensure M stays between 0 and 2π
}

// Function to calculate the Eccentric Anomaly from Mean Anomaly
function eccentricAnomaly(M, e) {
  let E = M; // Start with M as initial guess
  for (let i = 0; i < 10; i++) {
    E = M + e * Math.sin(E); // Iterative solution for E
  }
  return E;
}

// Function to calculate True Anomaly from Eccentric Anomaly
function trueAnomaly(E, e) {
  return 2 * Math.atan2(Math.sqrt(1 - e ** 2) * Math.sin(E), Math.cos(E) - e);
}

// Rotation matrix for Z-axis
function rotationMatrixZ(theta) {
  return [
    [Math.cos(theta), -Math.sin(theta), 0],
    [Math.sin(theta), Math.cos(theta), 0],
    [0, 0, 1],
  ];
}

// Rotation matrix for X-axis
function rotationMatrixX(theta) {
  return [
    [1, 0, 0],
    [0, Math.cos(theta), -Math.sin(theta)],
    [0, Math.sin(theta), Math.cos(theta)],
  ];
}

// Matrix multiplication function
function multiplyMatrices(A, B) {
  const result = [];
  for (let i = 0; i < A.length; i++) {
    result[i] = [];
    for (let j = 0; j < B[0].length; j++) {
      let sum = 0;
      for (let k = 0; k < A[0].length; k++) {
        sum += A[i][k] * B[k][j];
      }
      result[i][j] = sum;
    }
  }
  return result;
}

// Calculate RAAN (Right Ascension of Ascending Node) over time
function calculateRAAN(t, t0) {
  const delta_t = (t - t0) / 1000; // Time difference in seconds
  return raan0 + raan_rate * delta_t; // Updated RAAN calculation
}

// Calculate satellite's position at a given time
function satellitePositionAtTime(t, t0) {
  // Mean Anomaly
  const M = meanAnomaly(M0, n, t, t0);

  // Eccentric Anomaly
  const E = eccentricAnomaly(M, e);

  // True Anomaly
  const nu = trueAnomaly(E, e);

  // Distance from Earth's center to satellite
  const r = (a * (1 - e ** 2)) / (1 + e * Math.cos(nu));

  // Orbital coordinates in the orbital plane
  const x_orbit = r * Math.cos(nu);
  const y_orbit = r * Math.sin(nu);
  const z_orbit = 0;

  // Rotation matrices
  const RAAN = calculateRAAN(t, t0); // RAAN for current time
  const R3_Omega = rotationMatrixZ(-RAAN); // RAAN rotation
  const R1_i = rotationMatrixX(-i); // Inclination rotation
  const R3_omega = rotationMatrixZ(-arg_perigee); // Argument of perigee rotation

  // Combine rotations
  const rotationMatrix = multiplyMatrices(
    multiplyMatrices(R3_Omega, R1_i),
    R3_omega
  );

  // Transform orbital to geocentric coordinates
  const coordinates_orbital = [[x_orbit], [y_orbit], [z_orbit]];
  const coordinates_geocentric = multiplyMatrices(
    rotationMatrix,
    coordinates_orbital
  );

  const X = coordinates_geocentric[0][0];
  const Y = coordinates_geocentric[1][0];
  const Z = coordinates_geocentric[2][0];

  // Calculate longitude and latitude
  const longitude = Math.atan2(Y, X);
  const p = Math.sqrt(X ** 2 + Y ** 2); // Distance from Earth's axis
  let latitude = Math.atan2(Z, p);

  // Earth's eccentricity squared (WGS-84)
  const e2 = 0.00669437999;

  // Iterative latitude calculation to account for Earth's oblateness
  for (let i = 0; i < 5; i++) {
    const v = earth_radius / Math.sqrt(1 - e2 * Math.sin(latitude) ** 2);
    latitude = Math.atan2(Z + v * e2 * Math.sin(latitude), p);
  }

  // Altitude calculation
  const altitude = r - earth_radius;

  // Convert latitude and longitude to degrees
  const latitude_deg = (latitude * 180) / Math.PI;
  const longitude_deg = (longitude * 180) / Math.PI;

  return { latitude: latitude_deg, longitude: longitude_deg, altitude };
}

// Generate satellite position for each time step
export function satNow(setDate) {
  const t0 = new Date(Date.UTC(2024, 9, 1, 12, 8, 26)); // Epoch time
  const t = setDate ? new Date(setDate) : new Date(); // Current time or specified date
  const tJson = new Date().toJSON(); // Current time as JSON

  // Calculate satellite's position
  const { latitude, longitude, altitude } = satellitePositionAtTime(t, t0);

  return [latitude, longitude, altitude, tJson];
}

// Helper to create array of time intervals for orbit path
const getMinutesArray = (start, duration) => {
  const arr = [];
  const end = new Date(start);
  end.setUTCMinutes(end.getUTCMinutes() + duration); // Set the end time based on duration

  for (
    const dt = new Date(start);
    dt <= end;
    dt.setUTCMinutes(dt.getUTCMinutes() + 1)
  ) {
    arr.push(new Date(dt));
  }
  return arr;
};

// Generate orbit path over a specified duration in minutes (1440 minutes for 24 hours)
export const getOrbitPath = (date) => {
  const startTime = new Date(date); // Start time based on the specific date
  return getMinutesArray(startTime, 1440).map((e) => {
    // Generate for 1440 minutes (24 hours)
    return satNow(e);
  });
};

// Example usage: Generate the orbit path for one day starting from a specific date
const specificDate = "2024-10-01T12:08:26Z"; // Change this to your desired specific date
const orbitPathData = getOrbitPath(specificDate);
console.log(orbitPathData);

// Visualization function
export const visualizeOrbit = (data) => {
  data.forEach(([latitude, longitude, altitude, timestamp]) => {
    // Your visualization logic here, e.g., using a mapping library or drawing on a canvas
    console.log(
      `Latitude: ${latitude}, Longitude: ${longitude}, Altitude: ${altitude} km, Time: ${timestamp}`
    );
  });
};

// Call the visualization function with the generated data
visualizeOrbit(orbitPathData);
