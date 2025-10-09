// Test script to debug analytics tracking
import { trackBlogView } from './useAnalyticsSimple.js'

// This is just for testing - simulates clicking on a blog post
window.testBlogTracking = function() {
  console.log('🧪 Testing blog tracking...');
  
  // Simulate tracking a blog view
  trackBlogView('test-blog-id-123', 'Test Blog Post Title');
  
  console.log('✅ Test tracking sent!');
}

console.log('📊 Analytics test script loaded. Run testBlogTracking() in console to test.');