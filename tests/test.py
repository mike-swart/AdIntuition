from selenium import webdriver
from selenium.webdriver.common.keys import Keys
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC

TOTAL_TESTS = 0
PASSED_TESTS = 0
WAIT_TIME = 4

# check that an element was added to the page
# *** test_name is the name of the name that you would like to call this test
# *** element_name is the element that you are checking exists on the page
def check_for_element(test_name, element_name):
	global TOTAL_TESTS
	global PASSED_TESTS
	TOTAL_TESTS += 1
	try:
		element = WebDriverWait(driver, WAIT_TIME).until(EC.presence_of_element_located((By.ID, element_name)))
		PASSED_TESTS += 1
	except:
		print element_name + " Not Present for " + test_name + " Test"

# check that an element does not exist on a page
# *** test_name is the name of the name that you would like to call this test
# *** element_name is the element that you are checking exists on the page
def check_for_no_element(test_name, element_name):
	global TOTAL_TESTS
	global PASSED_TESTS
	TOTAL_TESTS += 1
	try:
		element = WebDriverWait(driver, WAIT_TIME).until(EC.presence_of_element_located((By.ID, element_name)))
		print element_name + " Was Present When Unexpected In " + test_name + " TEST"
	except:
		PASSED_TESTS += 1

#check for a highlighted link
# *** test_name is the name of the name that you would like to call this test
# * the highlight index is the index of the link that you want to highlight in the ordered list of all links in the description
def check_for_highlighted_link(test_name, highlight_index):
	global TOTAL_TESTS
	global PASSED_TESTS
	TOTAL_TESTS += 1
	try:
		element = driver.find_element_by_id("AdIntuitionDescription").find_elements_by_tag_name('a')[highlight_index]
		style = element.get_attribute("style")
		assert "background-color" in style
		PASSED_TESTS += 1
	except:
		print "Link Not Highlighted for " + test_name + " Test"

#check for a highlighted coupon code
def check_for_coupon_code(test_name, highlight_number):
	global TOTAL_TESTS
	global PASSED_TESTS
	TOTAL_TESTS += 1
	try:
		element = driver.find_element_by_id("AdIntuitionDescription").find_elements_by_tag_name('span')[highlight_number]
		style = element.get_attribute("style")
		assert "background-color" in style
		PASSED_TESTS += 1
	except:
		print "Coupon Code not highlighted for " + test_name + " Test"

# Load the extension into the browser
options = webdriver.ChromeOptions()
options.add_extension('./src.crx')
driver = webdriver.Chrome(chrome_options=options)

#Check that the known affiliate link 
test = "Known Affiliate Link"
driver.get("https://www.youtube.com/watch?v=SqxCZiuG9EM")
check_for_element(test, "AdIntuitionMarker")
check_for_element(test, "AdIntuition")
check_for_highlighted_link(test, 0)
driver.save_screenshot("screenshots/aff_url_shown.png")

#Check that the known affiliate link 
test = "UTM and Coupon Code"
driver.get("https://www.youtube.com/watch?v=jN93hZZu5do")
check_for_element(test, "AdIntuitionMarker")
check_for_element(test, "AdIntuitionCoupon")
check_for_highlighted_link(test, 0)
check_for_coupon_code(test, 0)
driver.save_screenshot("screenshots/utm&coupon_shown.png")

#Check that a YouTube video without affiliate marketing does not have a banner
test = "No Affiliate Banner"
driver.get("https://www.youtube.com/watch?v=M_6UPaSmJrk")
check_for_element(test, "AdIntuitionMarker")
check_for_no_element(test, "AdIntuitionCoupon")
check_for_no_element(test, "AdIntuition")
driver.save_screenshot("screenshots/no_banner.png")

#quit this driver
driver.quit()

#test that without the extension, tests will not pass
driver = webdriver.Chrome()
test = "No Extension"
driver.get("https://www.youtube.com/watch?v=SqxCZiuG9EM")
check_for_no_element(test, "AdIntuitionMarker")


#quit this driver
driver.quit()
	
# Show the number of successful tests
print str(PASSED_TESTS) + "/" + str(TOTAL_TESTS) + " Tests Passed"
