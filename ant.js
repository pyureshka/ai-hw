class AntColonyOptimization {
  constructor(
    graph,
    num_ants,
    alpha = 1,
    beta = 1,
    evaporation_rate = 0.5,
    initial_pheromone = 0.1,
    q = 1
  ) {
    this.graph = graph;
    this.num_ants = num_ants;
    this.alpha = alpha;
    this.beta = beta;
    this.evaporation_rate = evaporation_rate;
    this.initial_pheromone = initial_pheromone;
    this.q = q;
    this.pheromone_matrix = this._initialize_pheromone_matrix();
    this.best_path = null;
    this.best_path_length = Infinity;
  }

  _initialize_pheromone_matrix() {
    const num_vertices = this.graph.length;
    const pheromone_matrix = Array(num_vertices)
      .fill()
      .map(() => Array(num_vertices).fill(this.initial_pheromone));
    return pheromone_matrix;
  }

  _get_total_pheromone(vertex, unvisited_vertices) {
    const total_pheromone = unvisited_vertices.reduce((sum, next_vertex) => {
      const pheromone = this.pheromone_matrix[vertex][next_vertex];
      const distance = this.graph[vertex][next_vertex];
      return (
        sum +
        Math.pow(pheromone, this.alpha) * Math.pow(1 / distance, this.beta)
      );
    }, 0);
    return total_pheromone;
  }

  _select_next_vertex(current_vertex, unvisited_vertices) {
    const total_pheromone = this._get_total_pheromone(
      current_vertex,
      unvisited_vertices
    );
    const roulette_wheel = unvisited_vertices.reduce((wheel, next_vertex) => {
      const pheromone = this.pheromone_matrix[current_vertex][next_vertex];
      const distance = this.graph[current_vertex][next_vertex];
      const probability =
        (Math.pow(pheromone, this.alpha) * Math.pow(1 / distance, this.beta)) /
        total_pheromone;
      return wheel.concat(
        probability + (wheel.length > 0 ? wheel[wheel.length - 1] : 0)
      );
    }, []);

    const random_value = Math.random();
    const next_vertex_index = roulette_wheel.findIndex(
      (value) => value > random_value
    );
    const next_vertex = unvisited_vertices[next_vertex_index];

    return next_vertex;
  }

  _update_pheromone(paths, path_lengths) {
    paths.forEach((path, ant_index) => {
      const path_length = path_lengths[ant_index];
      path.forEach((vertex, vertex_index) => {
        if (vertex_index === path.length - 1) {
          return;
        }
        const next_vertex = path[vertex_index + 1];
        const pheromone_delta = this.q / path_length;
        this.pheromone_matrix[vertex][next_vertex] += pheromone_delta;
        this.pheromone_matrix[next_vertex][vertex] += pheromone_delta;
      });
    });
  }

  run(max_iter = null) {
    let iter = 0;
    let best_tour = null;
    let best_dist = Infinity;

    // Инициализация феромонов
    this._init_pheromone();

    while (max_iter === null || iter < max_iter) {
      // Создание муравьев
      let ants = this._create_ants();

      // Проход всех муравьев
      for (let ant of ants) {
        // Выполнение движения муравья
        ant.move(this._pheromone, this._distances);
      }

      // Обновление феромонов
      this._update_pheromone(ants);

      // Обновление лучшего пути
      for (let ant of ants) {
        if (ant.distance < best_dist) {
          best_dist = ant.distance;
          best_tour = ant.tour;
        }
      }

      iter++;
    }

    return {
      best_tour: best_tour,
      best_dist: best_dist,
    };
  }
}
