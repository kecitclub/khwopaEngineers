<?php
class Utilities {
    public static function sanitizeInput($data) {
        $data = trim($data);
        $data = stripslashes($data);
        $data = htmlspecialchars($data);
        return $data;
    }

    public static function generateBreadcrumb($paths) {
        $html = '<nav aria-label="breadcrumb"><ol class="breadcrumb">';
        $count = count($paths);
        $i = 1;
        
        foreach($paths as $title => $url) {
            if($i == $count) {
                $html .= '<li class="breadcrumb-item active" aria-current="page">'.htmlspecialchars($title).'</li>';
            } else {
                $html .= '<li class="breadcrumb-item"><a href="'.htmlspecialchars($url).'">'.htmlspecialchars($title).'</a></li>';
            }
            $i++;
        }
        
        $html .= '</ol></nav>';
        return $html;
    }

    public static function formatDate($date, $format = 'Y-m-d H:i:s') {
        return date($format, strtotime($date));
    }

    public static function generatePagination($total_pages, $current_page, $url_pattern) {
        $html = '<nav aria-label="Page navigation"><ul class="pagination">';
        
        // Previous button
        $html .= '<li class="page-item '.($current_page <= 1 ? 'disabled' : '').'">';
        $html .= '<a class="page-link" href="'.sprintf($url_pattern, $current_page-1).'" tabindex="-1">Previous</a></li>';
        
        // Page numbers
        for($i = 1; $i <= $total_pages; $i++) {
            $html .= '<li class="page-item '.($current_page == $i ? 'active' : '').'">';
            $html .= '<a class="page-link" href="'.sprintf($url_pattern, $i).'">'.$i.'</a></li>';
        }
        
        // Next button
        $html .= '<li class="page-item '.($current_page >= $total_pages ? 'disabled' : '').'">';
        $html .= '<a class="page-link" href="'.sprintf($url_pattern, $current_page+1).'">Next</a></li>';
        
        $html .= '</ul></nav>';
        return $html;
    }
}