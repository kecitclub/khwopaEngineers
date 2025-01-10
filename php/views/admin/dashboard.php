<div class="stats-grid">
    <!-- Total Vehicles -->
    <div class="stat-card">
        <div class="stat-icon" style="color: #6366F1;">
            <i class="fas fa-car"></i>
        </div>
        <div class="stat-label">Total Vehicles</div>
        <div class="stat-value">2,459</div>
        <div class="trend up">
            <i class="fas fa-arrow-up"></i>
            <span>3.48%</span>
            <span class="text-muted">vs last month</span>
        </div>
    </div>

    <!-- Active Cameras -->
    <div class="stat-card">
        <div class="stat-icon" style="color: #10B981;">
            <i class="fas fa-camera"></i>
        </div>
        <div class="stat-label">Active Cameras</div>
        <div class="stat-value">52</div>
        <div class="trend neutral">
            <i class="fas fa-arrows-alt-h"></i>
            <span>0%</span>
            <span class="text-muted">no change</span>
        </div>
    </div>

    <!-- Incidents Today -->
    <div class="stat-card">
        <div class="stat-icon" style="color: #F59E0B;">
            <i class="fas fa-exclamation-triangle"></i>
        </div>
        <div class="stat-label">Incidents Today</div>
        <div class="stat-value">13</div>
        <div class="trend down">
            <i class="fas fa-arrow-up"></i>
            <span>2.5%</span>
            <span class="text-muted">vs yesterday</span>
        </div>
    </div>

    <!-- Active Users -->
    <div class="stat-card">
        <div class="stat-icon" style="color: #6B7280;">
            <i class="fas fa-users"></i>
        </div>
        <div class="stat-label">Active Users</div>
        <div class="stat-value">245</div>
        <div class="trend up">
            <i class="fas fa-arrow-up"></i>
            <span>12%</span>
            <span class="text-muted">vs last week</span>
        </div>
    </div>
</div>

<!-- Recent Vehicle Detections -->
<div class="row">
    <div class="col-md-8">
        <div class="card">
            <div class="card-header">
                <h5>Recent Vehicle Detections</h5>
                <a href="#" class="btn-view-all">View All</a>
            </div>
            <div class="card-body">
                <table class="table">
                    <thead>
                        <tr>
                            <th>Time</th>
                            <th>Vehicle No.</th>
                            <th>Location</th>
                            <th>Status</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td>10:45 AM</td>
                            <td>BA 1 PA 2034</td>
                            <td>Koteshwor Junction</td>
                            <td><span class="status-badge status-clear">Clear</span></td>
                        </tr>
                        <tr>
                            <td>10:42 AM</td>
                            <td>BA 2 CHA 1422</td>
                            <td>Tinkune</td>
                            <td><span class="status-badge status-warning">Warning</span></td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
    </div>

    <div class="col-md-4">
        <div class="card">
            <div class="card-header">
                <h5>Camera Status</h5>
            </div>
            <div class="card-body">
                <div class="camera-status">
                    <span>Online Cameras</span>
                    <span class="text-success">48</span>
                </div>
                <div class="progress-bar">
                    <div class="progress-bar online"></div>
                </div>

                <div class="camera-status mt-4">
                    <span>Offline Cameras</span>
                    <span class="text-danger">4</span>
                </div>
                <div class="progress-bar">
                    <div class="progress-bar offline"></div>
                </div>
            </div>
        </div>
    </div>
</div>