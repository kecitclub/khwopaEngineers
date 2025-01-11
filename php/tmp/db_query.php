<?php
// Database connection
$dbHost = '193.203.185.164';
$dbName = 'u290660616_pustak';
$dbUser = 'u290660616_pustak';
$dbPass = 'Pustak@237';

try {
    $pdo = new PDO("mysql:host=$dbHost;dbname=$dbName", $dbUser, $dbPass);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

    // Handle form submission
    if ($_SERVER['REQUEST_METHOD'] == 'POST' && isset($_POST['query'])) {
        $query = trim($_POST['query']);
        $result = $pdo->query($query);
    }
} catch(PDOException $e) {
    $error = "Connection failed: " . $e->getMessage();
}
?>

<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Database Query Tool</title>
    <!-- Bootstrap CSS -->
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" rel="stylesheet">
    <!-- CodeMirror CSS for SQL highlighting -->
    <link href="https://cdnjs.cloudflare.com/ajax/libs/codemirror/5.65.2/codemirror.min.css" rel="stylesheet">
    <link href="https://cdnjs.cloudflare.com/ajax/libs/codemirror/5.65.2/theme/monokai.min.css" rel="stylesheet">
    <style>
        .CodeMirror {
            height: 150px;
            border: 1px solid #ddd;
            border-radius: 4px;
        }
        .query-container {
            margin-bottom: 20px;
        }
        .result-container {
            margin-top: 20px;
            overflow-x: auto;
        }
        .sample-queries {
            margin-top: 20px;
        }
    </style>
</head>
<body>
    <nav class="navbar navbar-dark bg-dark">
        <div class="container">
            <span class="navbar-brand">Database Query Tool</span>
        </div>
    </nav>

    <div class="container mt-4">
        <!-- Error Display -->
        <?php if (isset($error)): ?>
            <div class="alert alert-danger"><?php echo $error; ?></div>
        <?php endif; ?>

        <!-- Query Form -->
        <div class="card">
            <div class="card-body">
                <form method="POST" action="">
                    <div class="query-container">
                        <label for="query" class="form-label">SQL Query:</label>
                        <textarea id="query" name="query" class="form-control" rows="4"><?php echo isset($_POST['query']) ? htmlspecialchars($_POST['query']) : ''; ?></textarea>
                    </div>
                    <button type="submit" class="btn btn-primary">Execute Query</button>
                </form>
            </div>
        </div>

        <!-- Sample Queries -->
        <div class="card sample-queries">
            <div class="card-header">
                Sample Queries
            </div>
            <div class="card-body">
                <div class="row">
                    <div class="col-md-4">
                        <button class="btn btn-outline-secondary btn-sm mb-2 sample-query" data-query="SELECT * FROM users;">
                            Show All Users
                        </button>
                    </div>
                    <div class="col-md-4">
                        <button class="btn btn-outline-secondary btn-sm mb-2 sample-query" data-query="SELECT * FROM products;">
                            Show All Products
                        </button>
                    </div>
                    <div class="col-md-4">
                        <button class="btn btn-outline-secondary btn-sm mb-2 sample-query" data-query="SELECT * FROM orders;">
                            Show All Orders
                        </button>
                    </div>
                </div>
            </div>
        </div>

        <!-- Query Results -->
        <?php if (isset($result)): ?>
            <div class="card mt-4">
                <div class="card-header">
                    Query Results
                </div>
                <div class="card-body result-container">
                    <table class="table table-striped table-hover">
                        <?php
                        try {
                            // Get column names
                            $firstRow = true;
                            while ($row = $result->fetch(PDO::FETCH_ASSOC)) {
                                if ($firstRow) {
                                    echo "<thead><tr>";
                                    foreach ($row as $column => $value) {
                                        echo "<th>" . htmlspecialchars($column) . "</th>";
                                    }
                                    echo "</tr></thead><tbody>";
                                    $firstRow = false;
                                }
                                echo "<tr>";
                                foreach ($row as $value) {
                                    echo "<td>" . htmlspecialchars($value) . "</td>";
                                }
                                echo "</tr>";
                            }
                            echo "</tbody>";
                        } catch(Exception $e) {
                            echo "<tr><td class='text-danger'>Error executing query: " . $e->getMessage() . "</td></tr>";
                        }
                        ?>
                    </table>
                </div>
            </div>
        <?php endif; ?>
    </div>

    <!-- Scripts -->
    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/js/bootstrap.bundle.min.js"></script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/codemirror/5.65.2/codemirror.min.js"></script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/codemirror/5.65.2/mode/sql/sql.min.js"></script>
    <script>
        // Initialize CodeMirror
        var editor = CodeMirror.fromTextArea(document.getElementById('query'), {
            mode: 'text/x-mysql',
            theme: 'monokai',
            lineNumbers: true,
            indentWithTabs: true,
            smartIndent: true,
            lineWrapping: true,
            matchBrackets: true,
            autofocus: true
        });

        // Sample query buttons
        document.querySelectorAll('.sample-query').forEach(button => {
            button.addEventListener('click', () => {
                editor.setValue(button.dataset.query);
            });
        });
    </script>
</body>
</html>